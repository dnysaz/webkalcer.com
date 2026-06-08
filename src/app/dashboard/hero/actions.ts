"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveHero(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("hero_content")
    .update({
      badge_text: formData.get("badge_text") as string,
      headline: formData.get("headline") as string,
      subheadline_text: formData.get("subheadline_text") as string,
      cta_text: formData.get("cta_text") as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) redirect("/dashboard/hero?toast=error%3AFailed%20to%20save");
  revalidatePath("/", "layout");
  revalidatePath("/dashboard/hero");
  redirect("/dashboard/hero?toast=Hero%20saved%20successfully");
}
