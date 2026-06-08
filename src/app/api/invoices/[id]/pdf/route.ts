import fs from "fs";
import path from "path";
import React from "react";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import InvoicePDF from "./InvoicePDF";

function loadEmojiSrc(): string {
  try {
    const p = path.join(process.cwd(), "public", "images", "hand-emoji.png");
    const buf = fs.readFileSync(p);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch (e) {
    console.error("Failed to load emoji:", e);
    return "";
  }
}

function sanitizeFilename(s: string): string {
  return s.replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const match = id.match(/^(INV-\d{8}-\d{4})/);
  const invoiceNumber = match ? match[1] : id;

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("invoice_number", invoiceNumber)
    .single();

  if (!invoice) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoice.id)
    .order("id", { ascending: true });

  const { data: seo } = await supabase
    .from("seo_settings")
    .select("title, email, phone, favicon_url, sitename, logo_url")
    .eq("page", "home")
    .single();

  const emojiSrc = loadEmojiSrc();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfStream = await (renderToStream as any)(
    React.createElement(InvoicePDF, {
      emojiSrc,
      invoice: {
        invoice_number: invoice.invoice_number,
        customer_name: invoice.customer_name,
        customer_email: invoice.customer_email,
        customer_phone: invoice.customer_phone,
        created_at: invoice.created_at,
        status: invoice.status,
        paid_at: invoice.paid_at,
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        tax: invoice.tax,
        tax_percentage: invoice.tax_percentage,
        grand_total: invoice.grand_total,
        va_bank: invoice.va_bank,
        va_number: invoice.va_number,
        notes: invoice.notes,
      },
      items: items ?? [],
      seo: {
        title: seo?.sitename || seo?.title || "Webkalcer",
        email: seo?.email,
        phone: seo?.phone,
        favicon_url: seo?.logo_url || seo?.favicon_url,
      },
    }),
  );

  const chunks: Buffer[] = [];
  for await (const chunk of pdfStream) {
    chunks.push(Buffer.from(chunk as Uint8Array));
  }
  const pdfBuffer = Buffer.concat(chunks);

  const filename = `invoice-webkalcer-com-${sanitizeFilename(invoice.customer_name)}-${invoice.invoice_number}.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
