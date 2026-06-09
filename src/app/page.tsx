import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PHONE as ENV_PHONE, EMAIL as ENV_EMAIL } from "@/lib/config";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

const TechStack = dynamic(() => import("@/components/TechStack"));
const Stats = dynamic(() => import("@/components/Stats"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
const Portofolio = dynamic(() => import("@/components/Portofolio"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const Testimoni = dynamic(() => import("@/components/Testimoni"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Garansi = dynamic(() => import("@/components/Garansi"));
const CTA = dynamic(() => import("@/components/CTA"));
const Footer = dynamic(() => import("@/components/Footer"));
const TrackPageVisit = dynamic(() => import("@/components/TrackPageVisit"));

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
        <TechStack />
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
