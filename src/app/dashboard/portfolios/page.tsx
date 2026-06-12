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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-dark sm:text-2xl">Portfolio</h1>
          <p className="mt-1 text-xs font-bold text-zinc-500 sm:text-sm">Manage finished website examples.</p>
        </div>
        <Link href="/dashboard/portfolios/new" className="inline-flex self-start rounded-full bg-pink px-5 py-2 text-sm font-bold text-white transition hover:bg-pink-dark sm:self-auto">
          + Add
        </Link>
      </div>

      <div className="mt-6 space-y-3 sm:mt-8">
        {portfolios.length === 0 && <p className="text-sm font-bold text-zinc-500">No portfolios yet.</p>}
        {portfolios.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 rounded-lg border-2 border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-sm font-bold text-dark">{p.title}</p>
              <p className="mt-0.5 text-xs font-bold text-zinc-600">{p.tag}{p.url ? <span className="ml-2 text-pink">🔗 {p.url}</span> : null} {!p.is_active && <span className="text-red-400">(inactive)</span>}</p>
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
