"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/encryption";

export async function saveSeo(_prev: unknown, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const keywordsRaw = formData.get("keywords");
    const keywords = keywordsRaw
      ? (keywordsRaw as string).split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const serverKey = formData.get("server_key") as string;
    const clientKey = formData.get("client_key") as string;
    const isProduction = formData.get("is_production") === "on";

    const updates: Record<string, unknown> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      keywords,
      og_title: formData.get("og_title") as string,
      og_description: formData.get("og_description") as string,
      og_image_url: formData.get("og_image_url") as string,
      favicon_url: formData.get("favicon_url") as string,
      google_tag: formData.get("google_tag") as string,
      head_scripts: formData.get("head_scripts") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      wa_message: formData.get("wa_message") as string,
      midtrans_is_production: isProduction,
      updated_at: new Date().toISOString(),
    };

    if (serverKey) {
      const enc = encrypt(serverKey);
      if (enc) updates.midtrans_server_key_enc = enc;
    }
    if (clientKey) {
      const enc = encrypt(clientKey);
      if (enc) updates.midtrans_client_key_enc = enc;
    }

    const { error } = await supabase.from("seo_settings").update(updates).eq("page", "home");
    if (error) return { error: error.message || JSON.stringify(error) };

    // Save invoice fields separately (sitename, logo_url)
    await supabase.from("seo_settings").update({
      sitename: formData.get("sitename") as string,
      logo_url: formData.get("logo_url") as string,
      updated_at: new Date().toISOString(),
    }).eq("page", "home");

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/seo");
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { error: msg };
  }
}
