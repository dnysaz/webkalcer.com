"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildInvoiceSlug } from "@/lib/supabase/queries";

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const items: { description: string; price: number; package_id?: number | null }[] = JSON.parse(
    formData.get("items") as string,
  );

  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const taxPercentage = parseFloat(formData.get("tax_percentage") as string) || 0;
  const tax = subtotal * taxPercentage / 100;
  const grandTotal = subtotal - discount + tax;

  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });
  const seq = String((count ?? 0) + 1).padStart(4, "0");
  const invoiceNumber = `INV-${ymd}-${seq}`;

  const customerName = formData.get("customer_name") as string;

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      invoice_number: invoiceNumber,
      customer_name: customerName,
      customer_email: formData.get("customer_email") as string,
      customer_phone: formData.get("customer_phone") as string,
      subtotal,
      discount,
      tax,
      tax_percentage: taxPercentage,
      grand_total: grandTotal,
      notes: formData.get("notes") as string,
    })
    .select("id, invoice_number, customer_name")
    .single();

  if (error) redirect("/dashboard/invoices?toast=error%3AFailed%20to%20create%20invoice");

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("invoice_items").insert(
      items.map((i) => ({
        invoice_id: invoice.id,
        description: i.description,
        price: i.price,
        package_id: i.package_id || null,
      })),
    );
    if (itemsError) redirect("/dashboard/invoices?toast=error%3AFailed%20to%20save%20items");
  }

  revalidatePath("/dashboard/invoices");
  const slug = buildInvoiceSlug(invoice.invoice_number, invoice.customer_name);
  redirect(`/dashboard/invoices/${slug}?toast=Invoice%20created%20successfully`);
}

export async function saveVaPayment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const id = parseInt(formData.get("invoice_id") as string);
  const vaBank = formData.get("va_bank") as string;
  const vaNumber = formData.get("va_number") as string;

  const { error } = await supabase
    .from("invoices")
    .update({
      va_bank: vaBank,
      va_number: vaNumber,
      status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/invoices");
}

export async function removeVaPayment(invoiceId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("invoices")
    .update({
      va_bank: null,
      va_number: null,
      status: "draft",
      updated_at: new Date().toISOString(),
    })
    .eq("id", invoiceId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/invoices");
}

export async function checkPaymentStatus(invoiceId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: invoice } = await supabase
    .from("invoices")
    .select("midtrans_order_id")
    .eq("id", invoiceId)
    .single();

  if (!invoice?.midtrans_order_id) {
    return { error: "No Midtrans transaction found" };
  }

  const { default: midtransClient } = await import("midtrans-client");
  const { getMidtransConfig } = await import("@/lib/midtrans");
  const config = await getMidtransConfig();

  const api = new midtransClient.CoreApi({
    isProduction: config.isProduction,
    serverKey: config.serverKey,
    clientKey: config.clientKey,
  }) as unknown as { transaction: { status: (orderId: string) => Promise<{ transaction_status: string; transaction_id: string }> } };

  try {
    const status = await api.transaction.status(invoice.midtrans_order_id);
    const txStatus = status.transaction_status;

    let newStatus = "pending";
    if (txStatus === "capture" || txStatus === "settlement") {
      newStatus = "paid";
    } else if (txStatus === "cancel" || txStatus === "deny" || txStatus === "expire") {
      newStatus = "cancelled";
    }

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      status: newStatus,
      midtrans_transaction_id: status.transaction_id,
      updated_at: now,
    };
    if (newStatus === "paid") updates.paid_at = now;

    await supabase.from("invoices").update(updates).eq("id", invoiceId);

    revalidatePath("/dashboard/invoices");
    return { status: newStatus };
  } catch {
    return { error: "Failed to check payment status" };
  }
}

export async function deleteInvoice(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/invoices");
}
