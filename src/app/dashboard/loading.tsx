export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-2 h-3 w-20 rounded-full bg-zinc-200" />
            <div className="mb-1 h-7 w-16 rounded-lg bg-zinc-200" />
            <div className="h-2 w-12 rounded-full bg-zinc-100" />
          </div>
        ))}
      </div>

      {/* Invoice status skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {["Paid", "Pending", "Overdue", "Total"].map((label) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-2 h-3 w-14 rounded-full bg-zinc-200" />
            <div className="mb-1 h-6 w-12 rounded-lg bg-zinc-200" />
            <div className="h-2 w-10 rounded-full bg-zinc-100" />
          </div>
        ))}
      </div>

      {/* Revenue chart skeleton */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 h-4 w-32 rounded-full bg-zinc-200" />
        <div className="h-56 rounded-xl bg-zinc-100 sm:h-72" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 h-4 w-40 rounded-full bg-zinc-200" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-3 w-1/4 rounded-full bg-zinc-200" />
              <div className="h-3 w-1/6 rounded-full bg-zinc-100" />
              <div className="ml-auto h-6 w-16 rounded-full bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
