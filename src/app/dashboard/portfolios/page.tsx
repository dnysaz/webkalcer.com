import { getAllPortfolios } from "@/lib/supabase/queries";
import { deletePortfolio } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import PageToast from "@/components/PageToast";
import Link from "next/link";

export default async function PortfoliosPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const portfolios = await getAllPortfolios();
  const { toast } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl">
      <PageToast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Portfolio</h1>
          <p className="mt-1 text-sm font-bold text-zinc-400">Manage finished website examples.</p>
        </div>
        <Link href="/dashboard/portfolios/new" className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark">
          + Add
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {portfolios.length === 0 && <p className="text-sm font-bold text-zinc-400">No portfolios yet.</p>}
        {portfolios.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl border-2 border-zinc-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-bold text-dark">{p.title}</p>
              <p className="mt-0.5 text-xs font-bold text-zinc-400">{p.tag}{p.url ? <span className="ml-2 text-pink">🔗 {p.url}</span> : null} {!p.is_active && <span className="text-red-400">(inactive)</span>}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/portfolios/${p.id}`} className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
                Edit
              </Link>
              <DeleteButton id={p.id} label="portfolio" action={deletePortfolio} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
