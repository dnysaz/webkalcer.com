import { createClient } from "@/lib/supabase/server";
import { parseProposalSlug, getProposalWithItemsByNumber } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProposalForm from "../../new/ProposalForm";

export default async function EditProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposalNumber = parseProposalSlug(slug);
  if (!proposalNumber) notFound();

  const proposal = await getProposalWithItemsByNumber(proposalNumber);
  if (!proposal) notFound();

  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("id, name, price, promo")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/dashboard/proposals/${slug}`} className="mb-4 inline-block text-sm font-bold text-pink hover:underline">
        &larr; Back
      </Link>
      <h1 className="text-2xl font-black tracking-tighter text-dark">Edit Proposal</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-300">{proposal.proposal_number}</p>
      <ProposalForm
        packages={packages ?? []}
        initialData={{
          id: proposal.id,
          proposal_number: proposal.proposal_number,
          customer_name: proposal.customer_name,
          customer_email: proposal.customer_email || "",
          customer_phone: proposal.customer_phone || "",
          discount: Number(proposal.discount),
          tax_percentage: Number(proposal.tax_percentage),
          language: proposal.language || "id",
          notes: proposal.notes || "",
          signature_name: proposal.signature_name || "",
          items: (proposal.items || []).map((i: { description: string; price: number; package_id?: number | null }) => ({
            description: i.description,
            price: Number(i.price),
            package_id: i.package_id || null,
          })),
        }}
      />
    </div>
  );
}
