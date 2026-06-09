import type { Metadata, Viewport } from "next";
import { Baloo_Bhai_2 } from "next/font/google";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const baloo = Baloo_Bhai_2({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

async function getSeoSettings() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      },
    );
    const { data } = await supabase.from("seo_settings").select("*").eq("page", "home").single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();

  const title = seo?.title ?? "Webkalcer — Jasa Website Murah untuk UMKM & Personal Branding";
  const desc = seo?.description ?? "Jasa website murah Rp300ribu aja! Free domain, SSL, hosting. Tinggal chat, websitemu online. Untuk UMKM, personal branding, portofolio. Ga perlu ngoding.";
  const keywords = seo?.keywords ?? [];
  const ogTitle = seo?.og_title ?? title;
  const ogDesc = seo?.og_description ?? desc;
  const ogImage = seo?.og_image_url ?? undefined;
  const favicon = seo?.favicon_url ?? "/favicon.svg";

  return {
    title,
    description: desc,
    keywords,
    authors: { name: "webkalcer.com" },
    creator: "webkalcer.com",
    publisher: "webkalcer.com",
    metadataBase: new URL("https://webkalcer.com"),
    alternates: { canonical: "/" },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: "https://webkalcer.com",
      siteName: "webkalcer.com",
      locale: "id_ID",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    icons: {
      icon: [{ url: favicon, type: "image/svg+xml" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff3366",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const seo = await getSeoSettings();
  const googleTag = seo?.google_tag ?? "";
  const headScripts = seo?.head_scripts ?? "";

  return (
    <html lang="id" className={`${baloo.variable} h-full scroll-smooth`}>
      <head>
        {googleTag && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTag}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleTag}');
                `,
              }}
            />
          </>
        )}
        {headScripts && (
          <script dangerouslySetInnerHTML={{ __html: headScripts }} />
        )}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Webkalcer" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans">
        <a className="skip-link" href="#main">Lewati ke konten</a>
        <PwaRegister />
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
