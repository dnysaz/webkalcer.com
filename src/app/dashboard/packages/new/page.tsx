"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { useRouter } from "next/navigation";
import { createPackage } from "../actions";
import SubmitButton from "@/components/SubmitButton";
import FeaturesInput from "@/components/FeaturesInput";
import Link from "next/link";

const DRAFT_KEY = "wkc_pkg_draft";

type FieldValue = string | number | boolean | string[];

function loadDraft(): Record<string, FieldValue> {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveDraft(data: Record<string, FieldValue>) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {}
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

type ActionState = { error?: string; success?: boolean } | null;

async function wrappedAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  return createPackage(formData);
}

export default function NewPackagePage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(wrappedAction, null);
  const [draft, setDraft] = useState<Record<string, FieldValue>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadDraft();
    setDraft(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (state?.success) {
      clearDraft();
      router.push("/dashboard/packages?toast=Package%20added%20successfully");
    }
  }, [state, router]);

  function handleChange() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const data: Record<string, FieldValue> = {};
    fd.forEach((val, key) => {
      if (key === "thumbnail" || key === "catalog") return;
      data[key] = val as string;
    });
    data.is_active = fd.get("is_active") === "on";
    setDraft(data);
    saveDraft(data);
  }

  function handleReset() {
    clearDraft();
    setDraft({});
    if (formRef.current) formRef.current.reset();
  }

  if (!loaded) {
    return <div className="mx-auto max-w-4xl"><p className="text-sm font-bold text-zinc-400">Loading...</p></div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Add Package</h1>
          <p className="mt-1 text-sm font-bold text-zinc-500">Create a package for the pricelist page.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="rounded-full border-2 border-zinc-200 px-5 py-2 text-sm font-bold text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700">
            Reset Draft
          </button>
          <Link href="/dashboard/packages" className="rounded-full border-2 border-zinc-200 px-5 py-2 text-sm font-bold text-zinc-600 transition hover:border-red-300 hover:text-red-500">
            Cancel
          </Link>
        </div>
      </div>

      {state?.error && (
        <div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 px-6 py-4 text-sm font-bold text-red-600">
          Gagal: {state.error}
        </div>
      )}

      <form ref={formRef} action={formAction} onChange={handleChange} className="space-y-5">
        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Package Info</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Package Name</label>
              <input name="name" required defaultValue={String(draft.name || "")} placeholder="e.g. Kalcer Pemula" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Description</label>
              <input name="description" defaultValue={String(draft.description || "")} placeholder="Short description of the package" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Price (Rp)</label>
                <input name="price" type="number" required defaultValue={Number(draft.price) || 0} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Promo (Rp)</label>
                <input name="promo" type="number" defaultValue={Number(draft.promo) || 0} placeholder="0 = no promo" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Display</h2>
          <p className="mb-4 mt-1 text-xs font-bold text-zinc-500">Customize how this package looks on the pricelist page.</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Tagline (shown under name)</label>
              <input name="tagline" defaultValue={String(draft.tagline || "")} placeholder="e.g. Single landing page" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Price Note (under price)</label>
              <input name="price_note" defaultValue={String(draft.price_note || "")} placeholder="e.g. All-in — domain + hosting 1 year" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Note (bottom of card)</label>
              <input name="note" defaultValue={String(draft.note || "")} placeholder="e.g. Pay after completion — zero risk!" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Badge (sticker)</label>
                <input name="badge" defaultValue={String(draft.badge || "")} placeholder="e.g. Best Seller" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
              <div className="w-32">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Icon (emoji)</label>
                <input name="icon" defaultValue={String(draft.icon || "")} placeholder="📦" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Features</h2>
          <p className="mb-4 mt-1 text-xs font-bold text-zinc-500">Add features/benefits for this package.</p>
          <FeaturesInput defaultValue={Array.isArray(draft.features) ? draft.features as string[] : []} />
        </div>

        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Thumbnail</h2>
          <p className="mb-4 mt-1 text-xs font-bold text-zinc-500">Upload a package thumbnail image (optional).</p>
          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-600">Thumbnail Image</label>
            <input name="thumbnail" type="file" accept="image/*" className="w-full text-sm font-bold text-zinc-500 file:mr-3 file:rounded-full file:border-0 file:bg-pink/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-pink hover:file:bg-pink/20" />
          </div>
        </div>

        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Settings</h2>
          <div className="mt-4 flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold text-zinc-600">Sort Order</label>
              <input name="sort_order" type="number" defaultValue={Number(draft.sort_order) || 0} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                <input name="is_active" type="checkbox" defaultChecked={draft.is_active !== false} className="h-5 w-5 rounded border-zinc-300 text-pink" />
                Active
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <SubmitButton>Save</SubmitButton>
          <button
            type="submit"
            name="draft"
            value="1"
            className="rounded-full border-2 border-zinc-300 bg-white px-8 py-3 text-sm font-bold text-zinc-600 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            Save Draft
          </button>
        </div>
      </form>
    </div>
  );
}
