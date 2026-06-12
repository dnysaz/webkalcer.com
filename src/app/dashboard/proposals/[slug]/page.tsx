import { getProposalWithItemsByNumber, parseProposalSlug, buildProposalSlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
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

const langLabels: Record<string, string> = {
  id: "Indonesia",
  en: "English",
};

export default async function ProposalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposalNumber = parseProposalSlug(slug);
  if (!proposalNumber) notFound();

  const proposal = await getProposalWithItemsByNumber(proposalNumber);
  if (!proposal) notFound();

  const slugified = buildProposalSlug(proposal.proposal_number, proposal.customer_name);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/dashboard/proposals" className="mb-4 inline-block text-sm font-bold text-pink hover:underline">
        &larr; Back
      </Link>

      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-black tracking-tighter text-dark sm:text-2xl">{proposal.proposal_number}</h1>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyles[proposal.status] || statusStyles.draft}`}>
            {statusLabels[proposal.status] || proposal.status}
          </span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-bold text-zinc-500">
            {langLabels[proposal.language] || "Indonesia"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/proposals/${slugified}/edit`}
            className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink"
          >
            Edit
          </Link>
          <Link
            href={`/dashboard/proposals/${slugified}/pdf`}
            target="_blank"
            className="rounded-full bg-pink px-4 py-1.5 text-xs font-bold text-white transition hover:bg-pink-dark"
          >
            Open PDF
          </Link>
        </div>
      </div>

      {/* Client */}
      <div className="mb-3 border-b border-zinc-200 pb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-300">Client</p>
        <p className="mt-1 text-sm font-black text-dark">{proposal.customer_name}</p>
        {proposal.customer_email && <p className="text-sm font-bold text-zinc-500">{proposal.customer_email}</p>}
        {proposal.customer_phone && <p className="text-sm font-bold text-zinc-500">{proposal.customer_phone}</p>}
      </div>

      {/* Date */}
      <div className="mb-3 border-b border-zinc-200 pb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-300">Date</p>
        <p className="mt-1 text-sm font-bold text-zinc-600">
          {new Date(proposal.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Items */}
      <div className="mb-3 border-b border-zinc-200 pb-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-300">Proposed Items</p>
        {!proposal.items || proposal.items.length === 0 ? (
          <p className="py-2 text-sm font-bold text-zinc-300">No items yet.</p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {proposal.items.map((item: { id: number; description: string; price: number; package_id?: number | null }) => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  {item.package_id && <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-bold text-teal">PACKAGE</span>}
                  <span className="text-sm font-bold text-dark">{item.description}</span>
                </div>
                <span className="text-nowrap text-sm font-bold text-zinc-600">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="mb-3 border-b border-zinc-200 pb-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm font-bold text-zinc-500">
            <span>Subtotal</span>
            <span>{formatPrice(proposal.subtotal)}</span>
          </div>
          {proposal.discount > 0 && (
            <div className="flex items-center justify-between text-sm font-bold text-red-400">
              <span>Discount</span>
              <span>-{formatPrice(proposal.discount)}</span>
            </div>
          )}
          {proposal.tax > 0 && (
            <div className="flex items-center justify-between text-sm font-bold text-zinc-500">
              <span>Tax {proposal.tax_percentage > 0 ? `(${proposal.tax_percentage}%)` : ""}</span>
              <span>{formatPrice(proposal.tax)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-base font-black text-dark">
            <span>Grand Total</span>
            <span>{formatPrice(proposal.grand_total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {proposal.notes && (
        <div className="mb-3 border-b border-zinc-200 pb-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-zinc-300">Notes</p>
          <p className="text-sm font-bold text-zinc-600 whitespace-pre-wrap">{proposal.notes}</p>
        </div>
      )}
    </div>
  );
}
