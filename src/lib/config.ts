export const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "6285792721649";
export const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "halo@webkalcer.com";

const msg = "Halo kak, saya mau buat website di webkalcer.com , bisa dibantu?";
export const WA_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
