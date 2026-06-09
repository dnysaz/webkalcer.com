import { getAllPackages } from "@/lib/supabase/queries";
import { deletePackage } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import PageToast from "@/components/PageToast";
import Link from "next/link";

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const packages = await getAllPackages();
  const { toast } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl">
      <PageToast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Package</h1>
          <p className="mt-1 text-sm font-bold text-zinc-500">Manage offer packages for clients.</p>
        </div>
        <Link href="/dashboard/packages/new" className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark">
          + Add
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.length === 0 && <p className="col-span-full text-sm font-bold text-zinc-500">No packages yet.</p>}
        {packages.map((p) => (
          <div key={p.id} className="flex flex-col rounded-2xl border-2 border-zinc-200 bg-white shadow-sm">
            {p.thumbnail_url && (
              <div className="h-40 overflow-hidden rounded-t-2xl bg-zinc-100">
                <img src={p.thumbnail_url} alt={p.name} className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black text-dark">{p.name}</h3>
                {!p.is_active && <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-400">inactive</span>}
              </div>
              {p.description && <p className="mt-1 line-clamp-2 text-xs font-bold text-zinc-500">{p.description}</p>}
              <div className="mt-3 space-y-1">
                <p className="text-lg font-black text-dark">{formatPrice(p.price)}</p>
                {Number(p.promo) > 0 && <p className="text-sm font-bold text-pink">Promo: {formatPrice(p.promo)}</p>}
              </div>
              {p.catalog_url && (
                <a href={p.catalog_url} target="_blank" className="mt-2 text-xs font-bold text-teal hover:underline">
                  📄 View Catalog
                </a>
              )}
              <div className="mt-4 flex items-center gap-2">
                <Link href={`/dashboard/packages/${p.id}`} className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
                  Edit
                </Link>
                <DeleteButton id={p.id} label="package" action={deletePackage} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
