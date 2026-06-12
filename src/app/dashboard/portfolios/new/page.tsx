import { createPortfolio } from "../actions";
import SubmitButton from "@/components/SubmitButton";

export default function NewPortfolioPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-black tracking-tighter text-dark">Add Portfolio</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-500">Add a finished website example.</p>

      <form action={createPortfolio} className="space-y-5">
        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Portfolio Data</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Title</label>
              <input name="title" required className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Tag (e.g. UMKM, Personal Branding)</label>
              <input name="tag" required className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Website Link</label>
              <input name="url" type="url" placeholder="https://contoh.com" className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Sort Order</label>
                <input name="sort_order" type="number" defaultValue={0} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
              <div className="flex items-end pb-3">
                <label className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                  <input name="is_active" type="checkbox" defaultChecked className="h-5 w-5 rounded border-zinc-300 text-pink" />
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>
        <SubmitButton>Save</SubmitButton>
      </form>
    </div>
  );
}
