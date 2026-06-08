import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMidtransConfig } from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const { invoice_id } = await req.json();
    if (!invoice_id) {
      return NextResponse.json({ error: "invoice_id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: invoice, error: fetchErr } = await supabase
      .from("invoices")
      .select("id, midtrans_order_id")
      .eq("id", invoice_id)
      .single();

    if (fetchErr || !invoice) {
      return NextResponse.json({ error: "Invoice not found: " + (fetchErr?.message || "") }, { status: 404 });
    }
    if (!invoice.midtrans_order_id) {
      return NextResponse.json({ error: "No Midtrans transaction found" }, { status: 404 });
    }

    const config = await getMidtransConfig();
    if (!config.serverKey) {
      return NextResponse.json({ error: "Midtrans server key not configured. Go to Settings > Midtrans." }, { status: 400 });
    }

    const { default: midtransClient } = await import("midtrans-client");
    const api = new midtransClient.CoreApi({
      isProduction: config.isProduction,
      serverKey: config.serverKey,
      clientKey: config.clientKey,
    }) as unknown as { transaction: { status: (orderId: string) => Promise<Record<string, unknown>> } };

    const response = await api.transaction.status(invoice.midtrans_order_id);
    const txStatus = String(response.transaction_status || "");

    let newStatus = "pending";
    if (txStatus === "capture" || txStatus === "settlement") {
      newStatus = "paid";
    } else if (["cancel", "deny", "expire"].includes(txStatus)) {
      newStatus = "cancelled";
    }

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      status: newStatus,
      updated_at: now,
    };
    if (newStatus === "paid") updates.paid_at = now;

    const { error: updateErr } = await supabase.from("invoices").update(updates).eq("id", invoice_id);
    if (updateErr) {
      return NextResponse.json({ error: "DB update failed: " + updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ status: newStatus, midtrans_status: txStatus });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Midtrans check error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
