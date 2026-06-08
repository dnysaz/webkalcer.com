import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMidtransSnap } from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const { invoice_id } = await req.json();
    if (!invoice_id) {
      return NextResponse.json({ error: "invoice_id required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: invoice } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoice_id)
      .single();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "paid") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
    }

    if (invoice.midtrans_snap_token && invoice.midtrans_order_id) {
      return NextResponse.json({
        snap_token: invoice.midtrans_snap_token,
        already_created: true,
      });
    }

    const midtransSnap = await getMidtransSnap();
    const uniqueOrderId = `${invoice.invoice_number}-${Date.now()}`;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/dashboard/invoices/${invoice.slug}`;

    const transaction = await midtransSnap.createTransaction({
      transaction_details: {
        order_id: uniqueOrderId,
        gross_amount: Number(invoice.grand_total),
      },
      customer_details: {
        first_name: invoice.customer_name,
        email: invoice.customer_email || undefined,
        phone: invoice.customer_phone || undefined,
      },
      callbacks: {
        finish: redirectUrl,
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    await supabase
      .from("invoices")
      .update({
        midtrans_snap_token: transaction.token,
        midtrans_order_id: uniqueOrderId,
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoice_id);

    return NextResponse.json({
      snap_token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
