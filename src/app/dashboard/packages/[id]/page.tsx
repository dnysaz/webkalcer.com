import { getPackage } from "@/lib/supabase/queries";
import { updatePackage } from "../actions";
import { notFound } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPackage(Number(id));
  if (!p) notFound();

  const updateWithId = updatePackage.bind(null, p.id);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-black tracking-tighter text-dark">Edit Package</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-500">Edit package data.</p>

      <form action={updateWithId} className="space-y-5">
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Data Package</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Package Name</label>
              <input name="name" defaultValue={p.name} required className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Description</label>
              <textarea name="description" defaultValue={p.description} rows={4} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Price (Rp)</label>
                <input name="price" type="number" defaultValue={p.price} required className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Promo (Rp)</label>
                <input name="promo" type="number" defaultValue={p.promo} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Catalog &amp; Thumbnail</h2>
          {p.catalog_url && (
            <p className="mb-2 mt-2 text-xs font-bold text-zinc-500">
              Current catalog: <a href={p.catalog_url} target="_blank" className="text-teal hover:underline">view file</a>
            </p>
          )}
          {p.thumbnail_url && (
            <p className="mb-2 text-xs font-bold text-zinc-500">
              Current thumbnail: <a href={p.thumbnail_url} target="_blank" className="text-teal hover:underline">view image</a>
            </p>
          )}
          <p className="mb-4 text-xs font-bold text-zinc-500">Upload new files to replace.</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Catalog (PDF)</label>
              <input name="catalog" type="file" accept=".pdf,application/pdf" className="w-full text-sm font-bold text-zinc-500 file:mr-3 file:rounded-full file:border-0 file:bg-pink/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-pink hover:file:bg-pink/20" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Thumbnail (Image)</label>
              <input name="thumbnail" type="file" accept="image/*" className="w-full text-sm font-bold text-zinc-500 file:mr-3 file:rounded-full file:border-0 file:bg-pink/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-pink hover:file:bg-pink/20" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Settings</h2>
          <div className="mt-4 flex gap-4">
            <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Sort Order</label>
              <input name="sort_order" type="number" defaultValue={p.sort_order} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                <input name="is_active" type="checkbox" defaultChecked={p.is_active} className="h-5 w-5 rounded border-zinc-300 text-pink" />
                Active
              </label>
            </div>
          </div>
        </div>

        <SubmitButton>Save</SubmitButton>
      </form>
    </div>
  );
}
