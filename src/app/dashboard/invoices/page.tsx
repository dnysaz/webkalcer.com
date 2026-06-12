import { getAllInvoices, buildInvoiceSlug } from "@/lib/supabase/queries";
import { deleteInvoice } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import PageToast from "@/components/PageToast";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600",
  pending: "bg-yellow/20 text-yellow-800",
  paid: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-500",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  pending: "Pending",
  paid: "Paid",
  cancelled: "Cancelled",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const invoices = await getAllInvoices();
  const { toast } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl">
      <PageToast toast={toast} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-dark sm:text-2xl">Invoice</h1>
          <p className="mt-1 text-xs font-bold text-zinc-300 sm:text-sm">Manage invoices and payments.</p>
        </div>
        <Link href="/dashboard/invoices/new" className="inline-flex self-start rounded-full bg-pink px-5 py-2 text-sm font-bold text-white transition hover:bg-pink-dark sm:self-auto">
          + Create Invoice
        </Link>
      </div>

      <div className="mt-6 space-y-3 sm:mt-8">
        {invoices.length === 0 && <p className="text-sm font-bold text-zinc-400">No invoices yet.</p>}
        {invoices.map((inv) => (
          <div key={inv.id} className="flex flex-col gap-3 rounded-lg border-2 border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-dark">{inv.invoice_number}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusStyles[inv.status] || statusStyles.draft}`}>
                  {statusLabels[inv.status] || inv.status}
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-zinc-600">{inv.customer_name}</p>
              <p className="text-xs font-bold text-zinc-300">
                {new Date(inv.created_at).toLocaleDateString("id-ID")} · {formatPrice(inv.grand_total)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/invoices/${buildInvoiceSlug(inv.invoice_number, inv.customer_name)}`} className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
                Detail
              </Link>
              <DeleteButton id={inv.id} label="invoice" action={deleteInvoice} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
