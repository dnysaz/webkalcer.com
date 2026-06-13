"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "./DeleteButton";
import { X, Check } from "lucide-react";

function formatPrice(n: number | null | undefined) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n ?? 0);
}

interface PackageData {
  id: number;
  name: string;
  description?: string | null;
  tagline?: string | null;
  price_note?: string | null;
  note?: string | null;
  badge?: string | null;
  icon?: string | null;
  catalog_url?: string | null;
  thumbnail_url?: string | null;
  price: number;
  promo?: number | null;
  features?: string[] | null;
  is_active?: boolean | null;
  sort_order?: number | null;
}

export default function PackageCard({ pkg, deleteAction }: { pkg: PackageData; deleteAction: (id: number) => Promise<void> }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-zinc-200 bg-white shadow-sm transition hover:border-pink/40 hover:shadow-md"
        onClick={() => setModalOpen(true)}
      >
        {pkg.thumbnail_url && (
          <div className="h-40 overflow-hidden bg-zinc-100">
            <Image src={pkg.thumbnail_url} alt={pkg.name} width={400} height={160} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {pkg.icon && <span className="text-lg">{pkg.icon}</span>}
              <h3 className="text-base font-black text-dark">{pkg.name}</h3>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {pkg.badge && <span className="rounded-full bg-lime/30 px-2 py-0.5 text-[10px] font-bold text-dark">{pkg.badge}</span>}
              {!pkg.is_active && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-400">inactive</span>}
            </div>
          </div>
          {pkg.tagline && <p className="mt-0.5 text-xs font-bold text-zinc-400">{pkg.tagline}</p>}
          {pkg.description && <p className="mt-1 line-clamp-2 text-xs font-bold text-zinc-500">{pkg.description}</p>}
          <div className="mt-3 space-y-1">
            {Number(pkg.promo) > 0 ? (
              <>
                <p className="text-sm font-black text-zinc-400 line-through">{formatPrice(pkg.price)}</p>
                <p className="text-lg font-black text-pink">Promo {formatPrice(pkg.promo)}</p>
              </>
            ) : (
              <p className="text-lg font-black text-dark">{formatPrice(pkg.price)}</p>
            )}
          </div>
          {Array.isArray(pkg.features) && pkg.features.length > 0 && (
            <div className="mt-3 space-y-1">
              {pkg.features.slice(0, 4).map((f: string, i: number) => (
                <p key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lime/40 text-[8px] font-black text-dark">
                    <Check size={8} />
                  </span>
                  {f}
                </p>
              ))}
              {pkg.features.length > 4 && (
                <p className="text-[11px] font-bold text-pink">+{pkg.features.length - 4} more</p>
              )}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Link
              href={`/dashboard/packages/${pkg.id}`}
              className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink"
            >
              Edit
            </Link>
            <DeleteButton id={pkg.id} label="package" action={deleteAction} />
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-200 text-zinc-400 transition hover:border-zinc-400 hover:text-zinc-600"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-1">
              {pkg.icon && <span className="text-2xl">{pkg.icon}</span>}
              <h2 className="text-xl font-black tracking-tight text-dark">{pkg.name}</h2>
            </div>
            {pkg.badge && (
              <span className="inline-block rounded-full bg-lime/30 px-3 py-0.5 text-xs font-bold text-dark">{pkg.badge}</span>
            )}
            {!pkg.is_active && (
              <span className="ml-2 inline-block rounded-full bg-red-100 px-3 py-0.5 text-xs font-bold text-red-400">inactive</span>
            )}

            {pkg.tagline && <p className="mt-3 text-sm font-bold text-zinc-500">{pkg.tagline}</p>}
            {pkg.description && <p className="mt-2 text-sm font-bold leading-relaxed text-zinc-600">{pkg.description}</p>}

            <div className="mt-4 space-y-1">
              {Number(pkg.promo) > 0 ? (
                <>
                  <p className="text-lg font-black text-zinc-400 line-through">{formatPrice(pkg.price)}</p>
                  <p className="text-2xl font-black text-pink">Promo {formatPrice(pkg.promo)}</p>
                </>
              ) : (
                <p className="text-2xl font-black text-dark">{formatPrice(pkg.price)}</p>
              )}
              {pkg.price_note && <p className="text-xs font-bold text-zinc-400">{pkg.price_note}</p>}
            </div>

            {Array.isArray(pkg.features) && pkg.features.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-zinc-500">Features</p>
                <div className="space-y-2">
                  {pkg.features.map((f: string, i: number) => (
                    <p key={i} className="flex items-start gap-2 text-sm font-bold leading-snug text-dark">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow/30">
                        <Check size={12} className="text-dark" />
                      </span>
                      {f}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {pkg.note && (
              <p className="mt-4 text-xs font-black uppercase tracking-wide text-pink">{pkg.note}</p>
            )}

            {pkg.catalog_url && (
              <a
                href={pkg.catalog_url}
                target="_blank"
                rel="noopener"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-pink px-5 py-2 text-xs font-bold text-white transition hover:bg-pink-dark"
              >
                View Catalog
              </a>
            )}

            <div className="mt-6 flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs font-bold text-zinc-400">
              <span>Sort: {pkg.sort_order ?? 0}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
