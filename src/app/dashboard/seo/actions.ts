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

    const g = (key: string) => formData.get(key) as string | null;

    const updates: Record<string, unknown> = {};
    const title = g("title");
    if (title !== null) updates.title = title;
    const description = g("description");
    if (description !== null) updates.description = description;
    updates.keywords = keywords;
    for (const key of [
      "og_title", "og_description", "og_image_url", "favicon_url",
      "google_tag", "head_scripts", "phone", "email", "wa_message",
      "sitename", "logo_url",
      "proposal_company_name", "proposal_title",
      "proposal_slogan_id", "proposal_slogan_en", "proposal_logo_url",
      "proposal_opening_id", "proposal_opening_en",
      "proposal_closing_id", "proposal_closing_en",
      "proposal_terms_id", "proposal_terms_en",
      "proposal_intro2_id", "proposal_intro2_en",
      "proposal_package_desc_id", "proposal_package_desc_en",
    ]) {
      const val = g(key);
      if (val !== null) updates[key] = val;
    }
    updates.midtrans_is_production = isProduction;
    updates.updated_at = new Date().toISOString();

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

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/seo");
    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { error: msg };
  }
}
