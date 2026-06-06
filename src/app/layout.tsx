import type { Metadata } from "next";
import { Baloo_Bhai_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_Bhai_2({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Webkalcer — Punya website, ga pake ribet.",
  description:
    "Jasa website murah untuk UMKM & personal branding. Mulai Rp300rb websitemu online. Ga perlu ngoding, ga perlu pusing domain/server.",
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
