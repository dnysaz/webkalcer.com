import { getAllPackages } from "@/lib/supabase/queries";
import { deletePackage } from "./actions";
import PageToast from "@/components/PageToast";
import PackageCard from "@/components/PackageCard";
import Link from "next/link";

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const packages = await getAllPackages();
  const { toast } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl">
      <PageToast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Packages</h1>
          <p className="mt-1 text-sm font-bold text-zinc-500">Manage pricelist packages.</p>
        </div>
        <Link href="/dashboard/packages/new" className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white transition hover:bg-pink-dark">
          + Add Package
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.length === 0 && <p className="col-span-full text-sm font-bold text-zinc-500">No packages yet.</p>}
        {packages.map((p) => (
          <PackageCard key={p.id} pkg={p} deleteAction={deletePackage} />
        ))}
      </div>
    </div>
  );
}
