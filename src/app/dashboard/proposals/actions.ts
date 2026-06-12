"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildProposalSlug } from "@/lib/supabase/queries";

export async function createProposal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const items: { description: string; price: number; package_id?: number | null }[] = JSON.parse(
    formData.get("items") as string,
  );

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const taxPercentage = parseFloat(formData.get("tax_percentage") as string) || 0;
  const tax = subtotal * (taxPercentage / 100);
  const grandTotal = subtotal - discount + tax;

  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const { count } = await supabase
    .from("proposals")
    .select("*", { count: "exact", head: true });
  const seq = String((count ?? 0) + 1).padStart(4, "0");
  const proposalNumber = `PRO-${ymd}-${seq}`;

  const customerName = formData.get("customer_name") as string;
  const language = formData.get("language") as string || "id";

  const { data: proposal, error } = await supabase
    .from("proposals")
    .insert({
      proposal_number: proposalNumber,
      customer_name: customerName,
      customer_email: formData.get("customer_email") as string,
      customer_phone: formData.get("customer_phone") as string,
      subtotal,
      discount,
      tax_percentage: taxPercentage,
      tax,
      grand_total: grandTotal,
      language,
      notes: formData.get("notes") as string,
      signature_name: formData.get("signature_name") as string,
    })
    .select("id, proposal_number, customer_name")
    .single();

  if (error) redirect("/dashboard/proposals?toast=error%3AFailed%20to%20create%20proposal");

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("proposal_items").insert(
      items.map((i) => ({
        proposal_id: proposal.id,
        description: i.description,
        price: i.price,
        package_id: i.package_id || null,
      })),
    );
    if (itemsError) redirect("/dashboard/proposals?toast=error%3AFailed%20to%20save%20items");
  }

  revalidatePath("/dashboard/proposals");
  const slug = buildProposalSlug(proposal.proposal_number, proposal.customer_name);
  redirect(`/dashboard/proposals/${slug}?toast=Proposal%20created%20successfully`);
}

export async function updateProposal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const proposalId = parseInt(formData.get("proposal_id") as string);
  const items: { description: string; price: number; package_id?: number | null }[] = JSON.parse(
    formData.get("items") as string,
  );
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const taxPercentage = parseFloat(formData.get("tax_percentage") as string) || 0;
  const tax = subtotal * (taxPercentage / 100);
  const grandTotal = subtotal - discount + tax;
  const language = formData.get("language") as string || "id";

  const { error } = await supabase
    .from("proposals")
    .update({
      customer_name: formData.get("customer_name") as string,
      customer_email: formData.get("customer_email") as string,
      customer_phone: formData.get("customer_phone") as string,
      subtotal,
      discount,
      tax_percentage: taxPercentage,
      tax,
      grand_total: grandTotal,
      language,
      notes: formData.get("notes") as string,
      signature_name: formData.get("signature_name") as string,
    })
    .eq("id", proposalId);

  if (error) redirect("/dashboard/proposals?toast=error%3AFailed%20to%20update%20proposal");

  // Replace items: delete old, insert new
  await supabase.from("proposal_items").delete().eq("proposal_id", proposalId);

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("proposal_items").insert(
      items.map((i) => ({
        proposal_id: proposalId,
        description: i.description,
        price: i.price,
        package_id: i.package_id || null,
      })),
    );
    if (itemsError) redirect("/dashboard/proposals?toast=error%3AFailed%20to%20update%20items");
  }

  revalidatePath("/dashboard/proposals");
  const { data: proposal } = await supabase
    .from("proposals")
    .select("proposal_number, customer_name")
    .eq("id", proposalId)
    .single();

  if (proposal) {
    const slug = buildProposalSlug(proposal.proposal_number, proposal.customer_name);
    redirect(`/dashboard/proposals/${slug}?toast=Proposal%20updated%20successfully`);
  }
  redirect("/dashboard/proposals?toast=Proposal%20updated%20successfully");
}

export async function deleteProposal(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/proposals");
}
