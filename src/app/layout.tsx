import type { Metadata } from "next";
import { Baloo_Bhai_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_Bhai_2({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const title = "Webkalcer — Jasa Website Murah untuk UMKM & Personal Branding";
const desc =
  "Jasa website murah Rp300ribu aja! Free domain, SSL, hosting. Tinggal chat, websitemu online 1x24 jam. Untuk UMKM, personal branding, portofolio. Ga perlu ngoding.";

export const metadata: Metadata = {
  title,
  description: desc,
  keywords: [
    "jasa website murah",
    "website UMKM",
    "personal branding",
    "buat website murah",
    "website murah Indonesia",
    "jasa landing page",
    "webkalcer",
    "kalcer",
    "website murah 300rb",
    "jasa website 300 ribu",
    "bikin website online",
    "website usaha murah",
    "domain gratis",
    "jasa website tanpa coding",
    "web kalcer",
  ],
  authors: { name: "webkalcer.com" },
  creator: "webkalcer.com",
  publisher: "webkalcer.com",
  metadataBase: new URL("https://webkalcer.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: desc,
    url: "https://webkalcer.com",
    siteName: "webkalcer.com",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: desc,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${baloo.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans">
        {children}
      </body>
    </html>
  );
}
