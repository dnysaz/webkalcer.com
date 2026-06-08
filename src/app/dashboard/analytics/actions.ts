"use server";

import { createClient } from "@/lib/supabase/server";

export async function recordVisit() {
  const supabase = await createClient();
  await supabase.from("page_visits").insert({
    page: "home",
    visitor_id: crypto.randomUUID().slice(0, 8),
  });
}
