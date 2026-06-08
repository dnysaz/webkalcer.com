import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PHONE as ENV_PHONE, EMAIL as ENV_EMAIL } from "@/lib/config";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Portofolio from "@/components/Portofolio";
import Pricing from "@/components/Pricing";
import Testimoni from "@/components/Testimoni";
import FAQ from "@/components/FAQ";
import Garansi from "@/components/Garansi";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import TrackPageVisit from "@/components/TrackPageVisit";

async function getData() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } },
    );

    const [heroRes, testimoniRes, portfolioRes, seoRes] = await Promise.all([
      supabase.from("hero_content").select("*").limit(1).single(),
      supabase.from("testimonials").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
      supabase.from("portfolios").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
      supabase.from("seo_settings").select("phone,email,wa_message").eq("page", "home").single(),
    ]);

    return {
      hero: heroRes.data ?? null,
      testimonials: testimoniRes.data ?? [],
      portfolios: portfolioRes.data ?? [],
      phone: seoRes.data?.phone || ENV_PHONE,
      email: seoRes.data?.email || ENV_EMAIL,
      waMessage: seoRes.data?.wa_message || "",
    };
  } catch {
    return { hero: null, testimonials: [], portfolios: [], phone: ENV_PHONE, email: ENV_EMAIL, waMessage: "" };
  }
}

export default async function Home() {
  const { hero, testimonials, portfolios, phone, email, waMessage } = await getData();

  return (
    <>
      <Navbar phone={phone} waMessage={waMessage} />
      <main>
        <Hero hero={hero} phone={phone} waMessage={waMessage} />
        <Stats />
        <HowItWorks />
        <Portofolio items={portfolios} />
        <Pricing phone={phone} waMessage={waMessage} />
        <Testimoni items={testimonials} />
        <FAQ />
        <Garansi />
        <CTA phone={phone} email={email} waMessage={waMessage} />
      </main>
      <Footer email={email} />
      <TrackPageVisit />
    </>
  );
}
