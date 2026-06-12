"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveVaPayment, removeVaPayment } from "../actions";

const BANK_OPTIONS = [
  { value: "BCA", label: "BCA" },
  { value: "Mandiri", label: "Mandiri" },
  { value: "BNI", label: "BNI" },
  { value: "BRI", label: "BRI" },
  { value: "CIMB Niaga", label: "CIMB Niaga" },
  { value: "Permata", label: "Permata" },
  { value: "Danamon", label: "Danamon" },
  { value: "Maybank", label: "Maybank" },
  { value: "BSI", label: "BSI (Bank Syariah Indonesia)" },
  { value: "Lainnya", label: "Lainnya" },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function VaPaymentForm({
  invoiceId,
  vaBank,
  vaNumber,
  status,
  paidAt,
}: {
  invoiceId: number;
  vaBank: string | null;
  vaNumber: string | null;
  status: string;
  paidAt: string | null;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [bank, setBank] = useState(vaBank || "");
  const [number, setNumber] = useState(vaNumber || "");
  const [customBank, setCustomBank] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (status === "paid" && vaBank && vaNumber) {
    return (
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200 text-lg font-black text-green-700">
            ✓
          </div>
          <div>
            <p className="text-lg font-black text-green-700">Paid</p>
            <p className="text-sm font-bold text-green-600">
              via {vaBank} — {vaNumber}
            </p>
            {paidAt && (
              <p className="text-xs font-bold text-green-500">Paid at {formatDate(paidAt)}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (vaBank && vaNumber && !showForm) {
    return (
      <div className="rounded-lg border-2 border-teal/30 bg-teal/5 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal">Virtual Account Payment</h2>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(true);
                setCustomBank(!BANK_OPTIONS.some((b) => b.value === vaBank));
              }}
              className="rounded-full border-2 border-zinc-200 px-3 py-1 text-[11px] font-bold text-zinc-500 transition hover:border-teal hover:text-teal"
            >
              Edit
            </button>
            <form
              action={async () => {
                setDeleting(true);
                await removeVaPayment(invoiceId);
                router.refresh();
              }}
            >
              <button
                type="submit"
                disabled={deleting}
                className="rounded-full border-2 border-red-200 px-3 py-1 text-[11px] font-bold text-red-400 transition hover:border-red-400 hover:text-red-600 disabled:opacity-50"
              >
                {deleting ? "..." : "Delete"}
              </button>
            </form>
          </div>
        </div>
        <div className="rounded-md border-2 border-teal/20 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-teal/10 text-2xl font-black text-teal">
              VA
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Bank</p>
              <p className="text-lg font-black text-dark">{vaBank}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">No. Virtual Account</p>
              <p className="text-xl font-black tracking-wider text-teal">{vaNumber}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("va_bank", customBank ? (fd.get("va_bank_custom") as string) : bank);
    fd.set("invoice_id", String(invoiceId));
    await saveVaPayment(fd);
    setSaving(false);
    setShowForm(false);
    router.refresh();
  }

  return (
    <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Virtual Account (Manual)</h2>
      <p className="mb-4 mt-1 text-sm font-bold text-zinc-500">
        Manually input VA for offline payment.
      </p>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-80"
        >
          + Add VA
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-600">Select Bank</label>
            <select
              value={bank}
              onChange={(e) => {
                setBank(e.target.value);
                setCustomBank(e.target.value === "Lainnya");
              }}
              required
              className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
             >
              <option value="">-- Select Bank --</option>
              {BANK_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {customBank && (
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Bank Name (manual)</label>
              <input
                name="va_bank_custom"
                required
                placeholder="e.g. Bank Jago"
              className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-600">Virtual Account Number</label>
            <input
              name="va_number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              placeholder="e.g. 1234567890"
              className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-teal px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-80 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save VA"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border-2 border-zinc-500 px-6 py-2.5 text-sm font-bold text-zinc-200 transition hover:border-zinc-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
