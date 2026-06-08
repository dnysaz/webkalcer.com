"use client";

import { useState, useCallback } from "react";
import { createInvoice } from "../actions";

interface Package {
  id: number;
  name: string;
  price: number;
  promo: number | null;
}

interface InvoiceItem {
  type: "manual" | "package";
  description: string;
  price: number;
  package_id: number | null;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function parsePrice(s: string): number {
  return parseFloat(s.replace(/[^0-9]/g, "")) || 0;
}

export default function InvoiceForm({ packages }: { packages: Package[] }) {
  const [items, setItems] = useState<InvoiceItem[]>([{ type: "manual", description: "", price: 0, package_id: null }]);
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState("");

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const taxNominal = subtotal * taxPercent / 100;
  const grandTotal = subtotal - discount + taxNominal;

  const addManualItem = useCallback(() => {
    setItems((prev) => [...prev, { type: "manual", description: "", price: 0, package_id: null }]);
  }, []);

  const addPackage = useCallback((pkgId: string) => {
    if (!pkgId) return;
    const pkg = packages.find((p) => p.id === Number(pkgId));
    if (!pkg) return;
    setItems((prev) => [
      ...prev,
      { type: "package", description: pkg.name, price: Number(pkg.promo) || Number(pkg.price), package_id: pkg.id },
    ]);
    setSelectedPkg("");
  }, [packages]);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateItem = useCallback((index: number, field: "description" | "price", value: string) => {
    setItems((prev) => {
      const next = [...prev];
      if (field === "price") {
        next[index] = { ...next[index], price: parsePrice(value) };
      } else {
        next[index] = { ...next[index], description: value };
      }
      return next;
    });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("items", JSON.stringify(items));
    formData.set("discount", String(discount));
    formData.set("tax_percentage", String(taxPercent));
    await createInvoice(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Data */}
      <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
        <h2 className="text-base font-black text-dark">Customer Data</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-600">Customer Name</label>
            <input name="customer_name" required className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold text-zinc-600">Phone</label>
              <input name="customer_phone" type="tel" className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold text-zinc-600">Email</label>
              <input name="customer_email" type="email" className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-dark">Item</h2>
          <div className="flex items-center gap-2">
            <button type="button" onClick={addManualItem} className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
              + Manual
            </button>
            {packages.length > 0 && (
              <div className="flex items-center gap-1">
                <select
                  value={selectedPkg}
                  onChange={(e) => {
                    addPackage(e.target.value);
                  }}
                  className="rounded-full border-2 border-teal px-3 py-1.5 text-xs font-bold text-teal outline-none transition hover:border-teal-dark"
                >
                  <option value="">+ Package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatPrice(Number(p.promo) || Number(p.price))}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {items.length === 0 && <p className="text-sm font-bold text-zinc-400">No items yet.</p>}
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.type === "package" ? (
                <div className="flex flex-1 items-center gap-2 rounded-xl border-2 border-teal/30 bg-teal/5 px-4 py-3">
                  <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-bold text-teal">PACKAGE</span>
                  <span className="flex-1 text-sm font-bold text-dark">{item.description}</span>
                </div>
              ) : (
                <input
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="Item description"
                  required
                  className="flex-1 rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
                />
              )}
              <div className="relative w-48">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">Rp</span>
                <input
                  value={item.price ? formatPrice(item.price).replace(/^Rp\s?/, "") : ""}
                  onChange={(e) => item.type === "manual" && updateItem(i, "price", e.target.value)}
                  placeholder="0"
                  required
                  readOnly={item.type === "package"}
                  className="w-full rounded-xl border-2 border-zinc-200 py-3 pl-10 pr-4 text-right text-sm font-bold outline-none transition focus:border-pink read-only:bg-zinc-50 read-only:text-zinc-500"
                />
              </div>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} className="text-sm font-bold text-red-400 hover:text-red-600">
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
        <h2 className="text-base font-black text-dark">Total</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm font-bold text-zinc-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-zinc-600">Discount (Rp)</span>
            <input
              value={discount || ""}
              onChange={(e) => setDiscount(parsePrice(e.target.value))}
              placeholder="0"
              className="w-48 rounded-xl border-2 border-zinc-200 px-4 py-2.5 text-right text-sm font-bold outline-none transition focus:border-pink"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-zinc-600">Tax (%)</span>
            <div className="flex items-center gap-3">
              <div className="relative w-24">
                <input
                  value={taxPercent || ""}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0)}
                  placeholder="0"
                  className="w-full rounded-xl border-2 border-zinc-200 px-4 py-2.5 text-right text-sm font-bold outline-none transition focus:border-pink"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">%</span>
              </div>
              <span className="text-sm font-bold text-zinc-400">{formatPrice(taxNominal)}</span>
            </div>
          </div>
          <div className="border-t border-zinc-200 pt-3">
            <div className="flex items-center justify-between text-base font-black text-dark">
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6">
        <label className="mb-1 block text-sm font-bold text-zinc-600">Notes (optional)</label>
        <textarea name="notes" rows={2} className="w-full rounded-xl border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
      </div>

      <button className="rounded-full bg-pink px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark">
        Save Invoice
      </button>
    </form>
  );
}
