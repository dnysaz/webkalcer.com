import { getHero } from "@/lib/supabase/queries";
import { saveHero } from "./actions";
import PageToast from "@/components/PageToast";

export default async function HeroPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const hero = await getHero();
  const { toast } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl">
      <PageToast toast={toast} />
      <h1 className="text-2xl font-black tracking-tighter text-dark">Edit Hero</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-400">Edit text on the homepage hero section.</p>

      <form action={saveHero} className="space-y-5">
        <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Hero Content</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Badge</label>
              <input name="badge_text" defaultValue={hero?.badge_text ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Headline</label>
              <textarea name="headline" rows={4} defaultValue={hero?.headline ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              <p className="mt-1 text-xs text-zinc-400">Use \n for new line</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Subheadline</label>
              <input name="subheadline_text" defaultValue={hero?.subheadline_text ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">CTA Text</label>
              <input name="cta_text" defaultValue={hero?.cta_text ?? ""} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
          </div>
        </div>
        <button className="rounded-full bg-pink px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark">
          Save
        </button>
      </form>
    </div>
  );
}
