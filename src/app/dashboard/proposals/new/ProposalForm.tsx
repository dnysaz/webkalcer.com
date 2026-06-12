"use client";

import { useState, useCallback } from "react";
import { createProposal, updateProposal } from "../actions";

interface Package {
  id: number;
  name: string;
  price: number;
  promo: number | null;
}

interface ProposalItem {
  type: "manual" | "package";
  description: string;
  price: number;
  package_id: number | null;
}

interface InitialData {
  id: number;
  proposal_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  discount: number;
  tax_percentage: number;
  language: string;
  notes: string;
  signature_name: string;
  items: { description: string; price: number; package_id: number | null }[];
}

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function parsePrice(s: string): number {
  return parseFloat(s.replace(/[^0-9]/g, "")) || 0;
}

function initItems(data?: InitialData): ProposalItem[] {
  if (!data || !data.items?.length) return [{ type: "manual" as const, description: "", price: 0, package_id: null }];
  return data.items.map((i) => ({
    type: i.package_id ? "package" as const : "manual" as const,
    description: i.description,
    price: Number(i.price),
    package_id: i.package_id,
  }));
}

export default function ProposalForm({ packages, initialData }: { packages: Package[]; initialData?: InitialData }) {
  const [items, setItems] = useState<ProposalItem[]>(() => initItems(initialData));
  const [discount, setDiscount] = useState(initialData?.discount ?? 0);
  const [taxPct, setTaxPct] = useState(initialData?.tax_percentage ?? 0);
  const [selectedPkg, setSelectedPkg] = useState("");
  const [lang, setLang] = useState(initialData?.language ?? "id");
  const isEdit = !!initialData;

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const tax = subtotal * (taxPct / 100);
  const grandTotal = subtotal - discount + tax;

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

  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("items", JSON.stringify(items));
    formData.set("discount", String(discount));
    formData.set("tax_percentage", String(taxPct));
    formData.set("tax", String(tax));
    formData.set("language", lang);
    if (isEdit && initialData) {
      formData.set("proposal_id", String(initialData.id));
      await updateProposal(formData);
    } else {
      await createProposal(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language */}
      <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-dark">Bahasa / Language</span>
          <div className="flex overflow-hidden rounded-full border-2 border-zinc-200">
            <button
              type="button"
              onClick={() => setLang("id")}
              className={`px-5 py-1.5 text-xs font-bold transition ${
                lang === "id" ? "bg-pink text-white" : "bg-white text-zinc-500"
              }`}
            >
              Indonesia
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-5 py-1.5 text-xs font-bold transition ${
                lang === "en" ? "bg-pink text-white" : "bg-white text-zinc-500"
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Client Data */}
      <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
        <h2 className="text-base font-black text-dark">Client Data</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-zinc-600">Client Name</label>
            <input name="customer_name" required defaultValue={initialData?.customer_name} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold text-zinc-600">Phone</label>
              <input name="customer_phone" type="tel" defaultValue={initialData?.customer_phone} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold text-zinc-600">Email</label>
              <input name="customer_email" type="email" defaultValue={initialData?.customer_email} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-dark">Item</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={addManualItem} className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
              + Manual
            </button>
            {packages.length > 0 && (
              <div className="flex items-center gap-1">
                <select
                  value={selectedPkg}
                  onChange={(e) => { addPackage(e.target.value); }}
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
          {items.length === 0 && <p className="text-sm font-bold text-zinc-500">No items yet.</p>}
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              {item.type === "package" ? (
                <div className="flex flex-1 items-center gap-2 rounded-md border-2 border-teal/30 bg-teal/5 px-4 py-3">
                  <span className="rounded-full bg-teal/20 px-2 py-0.5 text-[10px] font-bold text-teal">PACKAGE</span>
                  <span className="flex-1 text-sm font-bold text-dark">{item.description}</span>
                </div>
              ) : (
                <input
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="Item description"
                  required
                  className="flex-1 rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
                />
              )}
              <div className="relative w-36 sm:w-48">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">Rp</span>
                <input
                  value={item.price ? formatPrice(item.price).replace(/^Rp\s?/, "") : ""}
                  onChange={(e) => item.type === "manual" && updateItem(i, "price", e.target.value)}
                  placeholder="0"
                  required
                  readOnly={item.type === "package"}
                  className="w-full rounded-md border-2 border-zinc-200 py-3 pl-10 pr-4 text-right text-sm font-bold outline-none transition focus:border-pink read-only:bg-zinc-50 read-only:text-zinc-500"
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
      <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
        <h2 className="text-base font-black text-dark">Total</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm font-bold text-zinc-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-sm font-bold text-zinc-600">Discount (Rp)</span>
            <input
              value={discount || ""}
              onChange={(e) => setDiscount(parsePrice(e.target.value))}
              placeholder="0"
              className="w-full rounded-md border-2 border-zinc-200 px-4 py-2.5 text-right text-sm font-bold outline-none transition focus:border-pink sm:w-48"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-sm font-bold text-zinc-600">Tax (%)</span>
            <input
              value={taxPct || ""}
              onChange={(e) => setTaxPct(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full rounded-md border-2 border-zinc-200 px-4 py-2.5 text-right text-sm font-bold outline-none transition focus:border-pink sm:w-48"
            />
          </div>
          {taxPct > 0 && (
            <div className="flex items-center justify-between text-sm font-bold text-zinc-600">
              <span>Tax ({taxPct}%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
          )}
          <div className="border-t border-zinc-200 pt-3">
            <div className="flex items-center justify-between text-base font-black text-dark">
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
        <label className="mb-1 block text-sm font-bold text-zinc-600">Notes (optional)</label>
        <textarea name="notes" rows={3} defaultValue={initialData?.notes} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
      </div>

      {/* Signature */}
      <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
        <h2 className="text-base font-black text-dark">Digital Signature</h2>
        <p className="mb-4 mt-1 text-xs font-bold text-zinc-500">Name to appear on the proposal as the authorized signatory.</p>
        <div>
          <label className="mb-1 block text-sm font-bold text-zinc-600">Signatory Name</label>
          <input
            name="signature_name"
            defaultValue={initialData?.signature_name || "Webkalcer Team"}
            className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-pink px-8 py-3 text-sm font-bold text-white transition hover:bg-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Update Proposal" : "Save Proposal"}
      </button>
    </form>
  );
}
