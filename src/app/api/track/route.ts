import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

async function lookupCountry(ip: string): Promise<string> {
  if (ip === "127.0.0.1" || ip === "::1") return "Localhost";
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country`, { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return data.country || "";
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    if (body.eventType === "page_visit") {
      const ip = getIp(req);
      const country = await lookupCountry(ip);
      await supabase.from("page_visits").insert({
        page: "home",
        visitor_id: ip,
        country,
      });
    } else if (body.eventType === "wa_click" || body.eventType === "email_click") {
      await supabase.from("analytics_events").insert({ event_type: body.eventType });
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
