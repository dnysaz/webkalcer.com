"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPortfolio(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("portfolios").insert({
    title: formData.get("title") as string,
    tag: formData.get("tag") as string,
    url: formData.get("url") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
  });

  if (error) redirect("/dashboard/portfolios?toast=error%3AFailed%20to%20add");
  revalidatePath("/dashboard/portfolios");
  redirect("/dashboard/portfolios?toast=Portfolio%20added%20successfully");
}

export async function updatePortfolio(id: number, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("portfolios").update({
    title: formData.get("title") as string,
    tag: formData.get("tag") as string,
    url: formData.get("url") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) redirect("/dashboard/portfolios?toast=error%3AFailed%20to%20save");
  revalidatePath("/dashboard/portfolios");
  redirect("/dashboard/portfolios?toast=Portfolio%20updated%20successfully");
}

export async function deletePortfolio(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("portfolios").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/portfolios");
}
