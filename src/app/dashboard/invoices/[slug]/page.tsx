import { getInvoiceWithItemsByNumber, parseInvoiceSlug, buildInvoiceSlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Link from "next/link";
import InvoiceActions from "./InvoiceActions";
import VaPaymentForm from "./VaPaymentForm";

const statusStyles: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  pending: "bg-yellow/20 text-yellow-800",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-500",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  pending: "Pending Payment",
  paid: "Paid",
  cancelled: "Cancelled",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const invoiceNumber = parseInvoiceSlug(slug);
  if (!invoiceNumber) notFound();

  const invoice = await getInvoiceWithItemsByNumber(invoiceNumber);
  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/dashboard/invoices" className="mb-4 inline-block text-sm font-bold text-pink hover:underline">
        &larr; Back
      </Link>

      {/* Header Actions */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-black tracking-tighter text-dark sm:text-2xl">{invoice.invoice_number}</h1>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyles[invoice.status] || statusStyles.draft}`}>
            {statusLabels[invoice.status] || invoice.status}
          </span>
        </div>
        <InvoiceActions invoice={invoice} />
      </div>

      {/* Customer Info */}
      <div className="mb-4 rounded-lg border-2 border-zinc-200 bg-white p-5 sm:mb-6 sm:p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Customer</h2>
        <p className="mt-2 text-lg font-black text-dark">{invoice.customer_name}</p>
        {invoice.customer_email && <p className="text-sm font-bold text-zinc-500">{invoice.customer_email}</p>}
        {invoice.customer_phone && <p className="text-sm font-bold text-zinc-500">{invoice.customer_phone}</p>}
      </div>

      {/* Items */}
      <div className="mb-4 rounded-lg border-2 border-zinc-200 bg-white sm:mb-6">
        <div className="border-b border-zinc-200 px-5 py-4 sm:px-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Item</h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {!invoice.items || invoice.items.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm font-bold text-zinc-300 sm:px-6">
              No items yet. This invoice may need to be edited or recreated.
            </div>
          ) : (
            invoice.items.map((item: { id: number; description: string; price: number; package_id?: number | null }) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2">
                  {item.package_id && <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-bold text-teal">PACKAGE</span>}
                  <span className="text-sm font-bold text-dark">{item.description}</span>
                </div>
                <span className="text-nowrap text-sm font-bold text-zinc-600">{formatPrice(item.price)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="mb-6 rounded-lg border-2 border-zinc-200 bg-white p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-bold text-zinc-500">
            <span>Subtotal</span>
            <span>{formatPrice(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex items-center justify-between text-sm font-bold text-red-400">
              <span>Discount</span>
              <span>-{formatPrice(invoice.discount)}</span>
            </div>
          )}
          {Number(invoice.tax) > 0 && (
            <div className="flex items-center justify-between text-sm font-bold text-zinc-500">
              <span>Tax {Number(invoice.tax_percentage) > 0 && `(${invoice.tax_percentage}%)`}</span>
              <span>{formatPrice(invoice.tax)}</span>
            </div>
          )}
          <div className="border-t border-zinc-200 pt-2">
            <div className="flex items-center justify-between text-lg font-black text-dark">
              <span>Grand Total</span>
              <span>{formatPrice(invoice.grand_total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Account Payment */}
      <div className="mb-6">
        <VaPaymentForm
          invoiceId={invoice.id}
          vaBank={invoice.va_bank}
          vaNumber={invoice.va_number}
          status={invoice.status}
          paidAt={invoice.paid_at}
        />
      </div>

      {/* Payment Info (if paid via Midtrans) */}
      {invoice.status === "paid" && invoice.midtrans_transaction_id && (
        <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-green-600">Midtrans Payment Info</h2>
          <p className="mt-2 text-sm font-bold text-green-700">Transaction ID: {invoice.midtrans_transaction_id}</p>
        </div>
      )}

      {invoice.notes && (
        <div className="mt-6 rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Notes</h2>
          <p className="mt-2 text-sm font-bold text-zinc-600">{invoice.notes}</p>
        </div>
      )}

      {/* PDF Link */}
      <div className="mt-8">
        <Link
          href={`/dashboard/invoices/${buildInvoiceSlug(invoice.invoice_number, invoice.customer_name)}.pdf`}
          target="_blank"
          className="rounded-full border-2 border-zinc-200 px-6 py-2.5 text-sm font-bold text-zinc-600 transition hover:border-pink hover:text-pink"
        >
          📄 Open Invoice (PDF)
        </Link>
      </div>
    </div>
  );
}
