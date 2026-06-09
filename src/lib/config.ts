export const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "6285792721649";
export const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "halo@webkalcer.com";

const waMsg =
  process.env.NEXT_PUBLIC_WA_MESSAGE ||
  "Halo kak, saya mau buat website di webkalcer.com , bisa dibantu?";
export const WA_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(waMsg)}`;

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^0-9+]/g, "").trim();
  if (!digits) return "";
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("08")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

export function buildWaUrl(phone?: string, message?: string) {
  const p = normalizePhone(phone || PHONE);
  const m = message || waMsg;
  if (!p) return "https://wa.me/";
  return `https://wa.me/${p}?text=${encodeURIComponent(m)}`;
}
