"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("testimonials").insert({
    quote: formData.get("quote") as string,
    name: formData.get("name") as string,
    role: formData.get("role") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
  });

  if (error) redirect("/dashboard/testimonials?toast=error%3AFailed%20to%20add");
  revalidatePath("/dashboard/testimonials");
  redirect("/dashboard/testimonials?toast=Testimonial%20added%20successfully");
}

export async function updateTestimonial(id: number, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("testimonials").update({
    quote: formData.get("quote") as string,
    name: formData.get("name") as string,
    role: formData.get("role") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) redirect("/dashboard/testimonials?toast=error%3AFailed%20to%20save");
  revalidatePath("/dashboard/testimonials");
  redirect("/dashboard/testimonials?toast=Testimonial%20updated%20successfully");
}

export async function deleteTestimonial(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/testimonials");
}
