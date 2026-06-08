import { createClient } from "@/lib/supabase/server";
import InvoiceForm from "./InvoiceForm";

export default async function NewInvoicePage() {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select("id, name, price, promo")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-black tracking-tighter text-dark">Create Invoice</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-400">Fill in customer data and invoice items.</p>
      <InvoiceForm packages={packages ?? []} />
    </div>
  );
}
