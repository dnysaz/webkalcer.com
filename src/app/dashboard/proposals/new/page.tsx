import { createClient } from "@/lib/supabase/server";
import ProposalForm from "./ProposalForm";

export default async function NewProposalPage() {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("id, name, price, promo")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-black tracking-tighter text-dark">Create Proposal</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-300">Fill in client data and proposal items.</p>
      <ProposalForm packages={packages ?? []} />
    </div>
  );
}
