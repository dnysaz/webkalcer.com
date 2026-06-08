import { getAllTestimonials } from "@/lib/supabase/queries";
import { deleteTestimonial } from "./actions";
import DeleteButton from "@/components/DeleteButton";
import PageToast from "@/components/PageToast";
import Link from "next/link";

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const testimonials = await getAllTestimonials();
  const { toast } = await searchParams;

  return (
    <div className="mx-auto max-w-4xl">
      <PageToast toast={toast} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-dark">Testimonials</h1>
          <p className="mt-1 text-sm font-bold text-zinc-400">Manage customer testimonials.</p>
        </div>
        <Link href="/dashboard/testimonials/new" className="rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-pink-dark">
          + Add
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {testimonials.length === 0 && <p className="text-sm font-bold text-zinc-400">No testimonials yet.</p>}
        {testimonials.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-2xl border-2 border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex-1">
              <p className="text-sm font-bold text-dark">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-1 text-xs font-bold text-zinc-400">{t.name} — {t.role} {!t.is_active && <span className="text-red-400">(inactive)</span>}</p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <Link href={`/dashboard/testimonials/${t.id}`} className="rounded-full border-2 border-zinc-200 px-4 py-1.5 text-xs font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
                Edit
              </Link>
              <DeleteButton id={t.id} label="testimonial" action={deleteTestimonial} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
