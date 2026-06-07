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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Portofolio />
        <Pricing />
        <Testimoni />
        <FAQ />
        <Garansi />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
