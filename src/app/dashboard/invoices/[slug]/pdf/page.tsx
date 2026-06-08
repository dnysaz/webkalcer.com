import { redirect } from "next/navigation";
import { parseInvoiceSlug } from "@/lib/supabase/queries";

export default async function PdfRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invoiceNumber = parseInvoiceSlug(slug);
  if (!invoiceNumber) redirect("/dashboard/invoices");
  redirect(`/api/invoices/${invoiceNumber}/pdf`);
}
