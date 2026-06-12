import { getPackage } from "@/lib/supabase/queries";
import { updatePackage } from "../actions";
import { notFound } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import FeaturesInput from "@/components/FeaturesInput";
import Link from "next/link";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPackage(Number(id));
  if (!p) notFound();

  const updateWithId = updatePackage.bind(null, p.id);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Edit Package</h1>
          <p className="mt-1 text-sm font-bold text-zinc-500">Edit package data.</p>
        </div>
        <Link
          href="/dashboard/packages"
          className="rounded-full border-2 border-zinc-200 px-5 py-2 text-sm font-bold text-zinc-600 transition hover:border-red-300 hover:text-red-500"
        >
          Cancel
        </Link>
      </div>

      <form action={updateWithId} className="space-y-5">
        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Package Info</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Package Name</label>
              <input name="name" defaultValue={p.name} required className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Description</label>
              <input name="description" defaultValue={p.description} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Price (Rp)</label>
                <input name="price" type="number" defaultValue={p.price} required className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Promo (Rp)</label>
                <input name="promo" type="number" defaultValue={p.promo} placeholder="0 = no promo" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
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
              <input name="tagline" defaultValue={p.tagline} placeholder="e.g. Single landing page" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Price Note (under price)</label>
              <input name="price_note" defaultValue={p.price_note} placeholder="e.g. All-in — domain + hosting 1 year" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Note (bottom of card)</label>
              <input name="note" defaultValue={p.note} placeholder="e.g. Pay after completion — zero risk!" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Badge (sticker)</label>
                <input name="badge" defaultValue={p.badge} placeholder="e.g. Best Seller" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
              <div className="w-32">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Icon (emoji)</label>
                <input name="icon" defaultValue={p.icon} placeholder="🌱" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Features</h2>
          <p className="mb-4 mt-1 text-xs font-bold text-zinc-500">Add features/benefits for this package.</p>
          <FeaturesInput defaultValue={p.features ?? []} />
        </div>

        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Thumbnail</h2>
          {p.thumbnail_url && (
            <div className="mb-3 mt-2">
              <p className="mb-1 text-xs font-bold text-zinc-500">Current thumbnail:</p>
              <img src={p.thumbnail_url} alt={p.name} className="h-32 w-56 rounded-md object-cover" />
            </div>
          )}
          <p className="mb-4 text-xs font-bold text-zinc-500">Upload a new image to replace.</p>
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
              <input name="sort_order" type="number" defaultValue={p.sort_order} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                <input name="is_active" type="checkbox" defaultChecked={p.is_active} className="h-5 w-5 rounded border-zinc-300 text-pink" />
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
