"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createPackage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const promo = parseFloat(formData.get("promo") as string) || 0;
  const sortOrder = parseInt(formData.get("sort_order") as string) || 0;
  const isActive = formData.get("is_active") === "on";

  const catalogFile = formData.get("catalog") as File | null;
  const thumbnailFile = formData.get("thumbnail") as File | null;

  let catalogUrl = "";
  let thumbnailUrl = "";

  if (catalogFile && catalogFile.size > 0) {
    const ext = catalogFile.name.split(".").pop() || "pdf";
    const path = `catalogs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("packages")
      .upload(path, catalogFile, { contentType: catalogFile.type });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("packages").getPublicUrl(path);
      catalogUrl = urlData.publicUrl;
    }
  }

  if (thumbnailFile && thumbnailFile.size > 0) {
    const ext = thumbnailFile.name.split(".").pop() || "jpg";
    const path = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("packages")
      .upload(path, thumbnailFile, { contentType: thumbnailFile.type });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("packages").getPublicUrl(path);
      thumbnailUrl = urlData.publicUrl;
    }
  }

  const { error } = await supabase.from("packages").insert({
    name,
    description,
    catalog_url: catalogUrl,
    thumbnail_url: thumbnailUrl,
    price,
    promo,
    is_active: isActive,
    sort_order: sortOrder,
  });

  if (error) redirect("/dashboard/packages?toast=error%3AFailed%20to%20add%20package");
  revalidatePath("/dashboard/packages");
  redirect("/dashboard/packages?toast=Package%20added%20successfully");
}

export async function updatePackage(id: number, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string) || 0;
  const promo = parseFloat(formData.get("promo") as string) || 0;
  const sortOrder = parseInt(formData.get("sort_order") as string) || 0;
  const isActive = formData.get("is_active") === "on";

  const catalogFile = formData.get("catalog") as File | null;
  const thumbnailFile = formData.get("thumbnail") as File | null;

  const updates: Record<string, unknown> = {
    name,
    description,
    price,
    promo,
    is_active: isActive,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };

  if (catalogFile && catalogFile.size > 0) {
    const ext = catalogFile.name.split(".").pop() || "pdf";
    const path = `catalogs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("packages")
      .upload(path, catalogFile, { contentType: catalogFile.type });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("packages").getPublicUrl(path);
      updates.catalog_url = urlData.publicUrl;
    }
  }

  if (thumbnailFile && thumbnailFile.size > 0) {
    const ext = thumbnailFile.name.split(".").pop() || "jpg";
    const path = `thumbnails/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("packages")
      .upload(path, thumbnailFile, { contentType: thumbnailFile.type });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("packages").getPublicUrl(path);
      updates.thumbnail_url = urlData.publicUrl;
    }
  }

  const { error } = await supabase.from("packages").update(updates).eq("id", id);

  if (error) redirect("/dashboard/packages?toast=error%3AFailed%20to%20save");
  revalidatePath("/dashboard/packages");
  redirect("/dashboard/packages?toast=Package%20updated%20successfully");
}

export async function deletePackage(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/packages");
}
