export default function PageSkeleton() {
  return (
    <div className="animate-pulse px-4">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 rounded-lg bg-zinc-200" />
          <div className="h-4 w-56 rounded-md bg-zinc-100" />
        </div>
        <div className="h-10 w-24 rounded-full bg-zinc-100" />
      </div>

      {/* Content blocks */}
      <div className="space-y-4">
        <div className="h-24 rounded-lg bg-zinc-100" />
        <div className="h-24 rounded-lg bg-zinc-100" />
        <div className="h-24 rounded-lg bg-zinc-100" />
      </div>
    </div>
  );
}
