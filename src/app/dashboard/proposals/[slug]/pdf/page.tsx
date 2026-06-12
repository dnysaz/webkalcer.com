import { redirect } from "next/navigation";
import { parseProposalSlug } from "@/lib/supabase/queries";

export default async function PdfRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposalNumber = parseProposalSlug(slug);
  if (!proposalNumber) redirect("/dashboard/proposals");
  redirect(`/api/proposals/${proposalNumber}/pdf`);
}
