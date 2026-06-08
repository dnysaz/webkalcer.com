import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyMidtransNotification, getMidtransConfig } from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status, transaction_id } = body;

    const config = await getMidtransConfig();

    if (!verifyMidtransNotification(order_id, status_code, gross_amount, signature_key, config.serverKey)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const supabase = await createClient();
    let { data: invoice } = await supabase
      .from("invoices")
      .select("*")
      .eq("midtrans_order_id", order_id)
      .single();

    if (!invoice) {
      const { data: fallback } = await supabase
        .from("invoices")
        .select("*")
        .eq("invoice_number", order_id)
        .single();
      invoice = fallback;
    }

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    let newStatus = invoice.status;
    if (transaction_status === "capture" || transaction_status === "settlement") {
      newStatus = "paid";
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      newStatus = "cancelled";
    }

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      status: newStatus,
      midtrans_transaction_id: transaction_id,
      updated_at: now,
    };
    if (newStatus === "paid") updates.paid_at = now;

    await supabase.from("invoices").update(updates).eq("id", invoice.id);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
