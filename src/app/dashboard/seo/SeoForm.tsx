"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { saveSeo } from "./actions";

type SeoData = {
  title?: string; description?: string; keywords?: string[];
  og_title?: string; og_description?: string; og_image_url?: string; favicon_url?: string;
  phone?: string; email?: string; wa_message?: string;
  google_tag?: string; head_scripts?: string;
  sitename?: string; logo_url?: string;
  midtrans_server_key_enc?: string; midtrans_client_key_enc?: string; midtrans_is_production?: boolean;
};

function ImageUploadField({ name, defaultValue, label, hint, folder }: {
  name: string; defaultValue?: string | null; label: string; hint?: string; folder: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setUrl(data.url);
      }
    } catch {
      setError("Upload failed. Check console.");
    }
    setUploading(false);
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-zinc-600">{label}</label>
      <div className="flex items-start gap-4">
        {url && (
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={label}
              className="h-16 w-16 rounded-xl border-2 border-zinc-200 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-full border-2 border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-pink hover:text-pink disabled:opacity-50"
            >
              {uploading ? "Uploading..." : url ? "Change" : "Upload"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => { setUrl(""); }}
                className="rounded-full border-2 border-red-200 px-4 py-2 text-sm font-bold text-red-400 transition hover:border-red-400 hover:text-red-500"
              >
                Clear
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/x-icon,image/vnd.microsoft.icon"
            className="hidden"
            onChange={handleFile}
          />
          <input name={name} type="hidden" value={url} />
          {url && (
            <p className="truncate text-xs font-bold text-zinc-400">{url}</p>
          )}
          {error && <p className="text-xs font-bold text-red-400">{error}</p>}
          {hint && !error && <p className="text-xs font-bold text-zinc-400">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

const tabs = [
  { id: "meta-tags", label: "Meta Tags" },
  { id: "open-graph", label: "Open Graph" },
  { id: "kontak", label: "Contact" },
  { id: "midtrans", label: "Midtrans" },
  { id: "invoice", label: "Invoice" },
  { id: "google-tag", label: "Google Tag" },
];

export default function SeoForm({ seo, serverKeyHint, clientKeyHint }: { seo: SeoData | null; serverKeyHint: string; clientKeyHint: string }) {
  const router = useRouter();
  const [tab, setTab] = useState("meta-tags");

  const [state, formAction, pending] = useActionState(saveSeo, null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Show toast when action completes
  useEffect(() => {
    if (!state) return;
    if (state.success) {
      setToast({ type: "success", text: "Settings saved successfully" });
      router.refresh(); // refresh server component data
    } else if (state.error) {
      setToast({ type: "error", text: state.error });
    }
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition ${
              tab === t.id
                ? "bg-pink text-white shadow-lg"
                : "border-2 border-zinc-200 bg-white text-zinc-600 hover:border-pink hover:text-pink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Meta Tags */}
      <div className={tab === "meta-tags" ? "block" : "hidden"}>
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Meta Tags</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Title</label>
              <input name="title" defaultValue={seo?.title ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Description</label>
              <textarea name="description" rows={3} defaultValue={seo?.description ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Keywords (separate with comma)</label>
              <input name="keywords" defaultValue={(seo?.keywords ?? []).join(", ")} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className={tab === "open-graph" ? "block" : "hidden"}>
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Open Graph & Favicon</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">OG Title</label>
              <input name="og_title" defaultValue={seo?.og_title ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">OG Description</label>
              <textarea name="og_description" rows={2} defaultValue={seo?.og_description ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <ImageUploadField
              name="og_image_url"
              defaultValue={seo?.og_image_url}
              label="OG Image"
              hint="Recommended: 1200x630px, max 5MB"
              folder="og"
            />
            <ImageUploadField
              name="favicon_url"
              defaultValue={seo?.favicon_url}
              label="Favicon"
              hint="Recommended: 32x32px or 512x512px. SVG recommended."
              folder="favicon"
            />
          </div>
        </div>
      </div>

      {/* Kontak */}
      <div className={tab === "kontak" ? "block" : "hidden"}>
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Contact</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">WhatsApp Number</label>
              <input name="phone" defaultValue={seo?.phone ?? ""} placeholder="628xxxxxxxxx" className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Email</label>
              <input name="email" type="email" defaultValue={seo?.email ?? ""} placeholder="halo@example.com" className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">WhatsApp Message</label>
              <textarea name="wa_message" rows={2} defaultValue={seo?.wa_message ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
          </div>
        </div>
      </div>

      {/* Midtrans */}
      <div className={tab === "midtrans" ? "block" : "hidden"}>
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Midtrans</h2>
          <p className="mb-6 mt-1 text-sm font-bold text-zinc-400">
            Midtrans payment gateway configuration. Data will be stored encrypted.
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-bold text-zinc-600">
                Server Key
                {serverKeyHint && <span className="text-xs text-emerald-600">✓ saved</span>}
              </label>
              <input
                name="server_key"
                type="password"
                placeholder={serverKeyHint || "Mid-server-xxxx"}
                className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
              />
              {serverKeyHint && (
                <p className="mt-1 text-xs font-bold text-zinc-400">Leave empty to keep current key.</p>
              )}
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-bold text-zinc-600">
                Client Key
                {clientKeyHint && <span className="text-xs text-emerald-600">✓ saved</span>}
              </label>
              <input
                name="client_key"
                type="password"
                placeholder={clientKeyHint || "Mid-client-xxxx"}
                className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
              />
              {clientKeyHint && (
                <p className="mt-1 text-xs font-bold text-zinc-400">Leave empty to keep current key.</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-3 text-sm font-bold text-zinc-600">
                <input
                  name="is_production"
                  type="checkbox"
                  defaultChecked={seo?.midtrans_is_production ?? false}
                  className="h-5 w-5 rounded border-zinc-300 text-pink"
                />
                Production Mode
              </label>
              <p className="mt-1 text-xs font-bold text-zinc-400">Check if using production keys (not sandbox).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice */}
      <div className={tab === "invoice" ? "block" : "hidden"}>
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Invoice</h2>
          <p className="mb-6 mt-1 text-sm font-bold text-zinc-400">
            Company info used in invoice header (kop).
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Sitename (nama perusahaan di kop invoice)</label>
              <input
                name="sitename"
                defaultValue={seo?.sitename ?? "Webkalcer"}
                placeholder="Webkalcer"
                className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
              />
              <p className="mt-1 text-xs font-bold text-zinc-400">Nama yang tampil di kop invoice (terpisah dari SEO title).</p>
            </div>
            <ImageUploadField
              name="logo_url"
              defaultValue={seo?.logo_url}
              label="Logo (untuk kop invoice)"
              hint="Recommended: square image, max 5MB"
              folder="logo"
            />
          </div>
        </div>
      </div>

      {/* Google Tag */}
      <div className={tab === "google-tag" ? "block" : "hidden"}>
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Google Tag & Head Scripts</h2>
          <p className="mt-1 text-xs font-bold text-zinc-400">These scripts will be inserted into the &lt;head&gt; tag.</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Google Tag ID (e.g. G-XXXXXXXXXX)</label>
              <input name="google_tag" defaultValue={seo?.google_tag ?? ""} placeholder="G-XXXXXXXXXX" className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Custom Head Scripts</label>
              <textarea name="head_scripts" rows={4} defaultValue={seo?.head_scripts ?? ""} placeholder="<script>...</script>" className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold font-mono outline-none transition focus:border-pink" />
              <p className="mt-1 text-xs text-zinc-400">Will be inserted into &lt;head&gt; before &lt;/head&gt;.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-pink px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        {toast && (
          <div
            className={`rounded-2xl border-2 px-5 py-3 text-sm font-bold shadow-xl backdrop-blur-sm ${
              toast.type === "success"
                ? "border-lime/30 bg-dark text-lime"
                : "border-red-400/30 bg-dark text-red-400"
            }`}
          >
            <span className="mr-2">{toast.type === "success" ? "✓" : "✕"}</span>
            {toast.text}
          </div>
        )}
      </div>
    </form>
  );
}
