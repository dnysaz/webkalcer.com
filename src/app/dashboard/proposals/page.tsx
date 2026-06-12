import { getAllProposals, buildProposalSlug } from "@/lib/supabase/queries";
import { deleteProposal } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import PageToast from "@/components/PageToast";
import Link from "next/link";

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

const statusStyles: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-500",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
};

export default async function ProposalsPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const proposals = await getAllProposals();
  const { toast } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl">
      <PageToast toast={toast} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-dark sm:text-2xl">Proposals</h1>
          <p className="mt-1 text-xs font-bold text-zinc-300 sm:text-sm">Manage client proposals.</p>
        </div>
        <Link href="/dashboard/proposals/new" className="inline-flex self-start rounded-full bg-pink px-5 py-2 text-sm font-bold text-white transition hover:bg-pink-dark sm:self-auto">
          + Create Proposal
        </Link>
      </div>

      <div className="mt-6 space-y-3 sm:mt-8">
        {proposals.length === 0 && <p className="text-sm font-bold text-zinc-400">No proposals yet.</p>}
        {proposals.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 rounded-lg border-2 border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-dark">{p.proposal_number}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusStyles[p.status] || statusStyles.draft}`}>
                  {statusLabels[p.status] || p.status}
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-zinc-600">{p.customer_name}</p>
              <p className="text-xs font-bold text-zinc-300">
                {new Date(p.created_at).toLocaleDateString("id-ID")} · {formatPrice(p.grand_total)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/proposals/${buildProposalSlug(p.proposal_number, p.customer_name)}`}
                className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink"
              >
                Detail
              </Link>
              <DeleteButton id={p.id} label="proposal" action={deleteProposal} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
