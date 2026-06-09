import { getSeo } from "@/lib/supabase/queries";
import { decrypt } from "@/lib/encryption";
import PageToast from "@/components/PageToast";
import SeoForm from "./SeoForm";

function maskKey(key: string | null | undefined): string {
  if (!key) return "";
  const decrypted = decrypt(key);
  if (!decrypted || decrypted.length < 3) return "•••••";
  const last3 = decrypted.slice(-3);
  return "•".repeat(decrypted.length - 3) + last3;
}

export default async function SeoPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  let seo: Record<string, unknown> | null = null;
  let toast: string | undefined;
  let serverKeyHint = "";
  let clientKeyHint = "";

  try {
    seo = await getSeo();
    const sp = await searchParams;
    toast = sp.toast;
    serverKeyHint = maskKey(seo?.midtrans_server_key_enc as string | null | undefined);
    clientKeyHint = maskKey(seo?.midtrans_client_key_enc as string | null | undefined);
  } catch (e) {
    console.error("SeoPage error:", e);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageToast toast={toast} />
      <h1 className="text-2xl font-black tracking-tighter text-dark">SEO & Settings</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-400">Manage meta tags, Google Tag, favicon, OG image, Midtrans, and Invoice.</p>
        <SeoForm seo={seo as never} serverKeyHint={serverKeyHint} clientKeyHint={clientKeyHint} />
    </div>
  );
}
