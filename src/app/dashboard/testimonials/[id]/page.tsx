import { getTestimonial } from "@/lib/supabase/queries";
import { updateTestimonial } from "../actions";
import { notFound } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTestimonial(Number(id));
  if (!t) notFound();

  const updateWithId = updateTestimonial.bind(null, t.id);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-black tracking-tighter text-dark">Edit Testimonial</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-500">Edit testimonial data.</p>

      <form action={updateWithId} className="space-y-5">
        <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
          <h2 className="text-base font-black text-dark">Testimonial Data</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Name</label>
              <input name="name" defaultValue={t.name} required className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Role / Job</label>
              <input name="role" defaultValue={t.role} required className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-zinc-600">Quote</label>
              <textarea name="quote" defaultValue={t.quote} required rows={3} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-bold text-zinc-600">Sort Order</label>
                <input name="sort_order" type="number" defaultValue={t.sort_order} className="w-full rounded-md border-2 border-zinc-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-pink" />
              </div>
              <div className="flex items-end pb-3">
                <label className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                  <input name="is_active" type="checkbox" defaultChecked={t.is_active} className="h-5 w-5 rounded border-zinc-300 text-pink" />
                  Active
                </label>
              </div>
            </div>
          </div>
        </div>
        <SubmitButton>Save</SubmitButton>
      </form>
    </div>
  );
}
