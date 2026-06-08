"use client";

import { useEffect, useRef, useState } from "react";
import { buildWaUrl } from "@/lib/config";

function OfferCard({ icon, label, desc, index }: { icon: string; label: string; desc: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group rounded-2xl border-2 border-orange/20 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-pink/50 hover:shadow-xl ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-3xl transition-transform group-hover:scale-110">{icon}</div>
      <div className="mt-2 text-sm font-black tracking-tight text-dark">{label}</div>
      <div className="text-xs font-bold text-zinc-500">{desc}</div>
    </div>
  );
}

function ServiceItem({ text, index }: { text: string; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="group flex items-start gap-3 rounded-2xl border-2 border-orange/10 bg-white p-5 text-sm font-bold leading-relaxed text-dark transition-all hover:-translate-y-0.5 hover:border-pink/40 hover:shadow-lg"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className={`mt-0.5 text-xl transition-all duration-300 ${hover ? "rotate-90 text-pink" : ""}`}>
        {hover ? "❤️" : "✨"}
      </span>
      {text}
    </div>
  );
}

export default function Pricing({ phone, waMessage }: { phone?: string; waMessage?: string }) {
  const waUrl = buildWaUrl(phone, waMessage);
  return (
    <section id="price" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-yellow/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-pink/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-block animate-float rounded-full bg-pink px-6 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-lg">
          💸 GA PAKE MIKIR HARGA
        </div>

        <h2 className="text-5xl font-black leading-none tracking-tighter sm:text-6xl lg:text-7xl">
          BUAT WEBSITE
          <br />
          MULAI DARI
        </h2>
        <div className="relative mx-auto mt-4 inline-block">
          <span className="inline-block -rotate-2 rounded-3xl bg-yellow px-8 py-3 text-5xl font-black text-dark shadow-2xl sm:text-6xl">
            RP300.000
          </span>
          <span className="absolute -top-3 -right-6 animate-float text-3xl">🔥</span>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-base font-bold leading-relaxed text-dark/60">
          Udah free domain, hosting, SSL — pokoknya tinggal pake kakak.
        </p>
        <p className="mt-1 text-sm font-black uppercase text-pink">
          lebih murah dari biaya nongkrong kakak di mall loh 🛍️
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-dark">
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime text-xs font-black text-dark">✓</span>
            Free Domain
          </span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime text-xs font-black text-dark">✓</span>
            SSL Gratis
          </span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime text-xs font-black text-dark">✓</span>
            SEO Maksimal
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            onClick={() => fetch("/api/track", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({eventType:"wa_click"}) }).catch(()=>{})}
            className="rounded-full bg-pink px-8 py-4 text-base font-bold text-white shadow-lg transition-transform hover:bg-pink-dark hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Tanya Harga Kak ✨
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            onClick={() => fetch("/api/track", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({eventType:"wa_click"}) }).catch(()=>{})}
            className="rounded-full border-2 border-pink/30 bg-white px-8 py-4 text-base font-bold text-dark shadow-sm transition-transform hover:border-pink hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Konsultasi Gratis
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
          {[
            { icon: "🎨", label: "FREE DOMAIN", desc: "domain gratis 1 thn" },
            { icon: "🚀", label: "LANGSUNG ONLINE", desc: "max 2x24 jam" },
            { icon: "🔒", label: "SSL GRATIS", desc: "HTTPS aman" },
            { icon: "📱", label: "RESPONSIVE", desc: "buka di HP/PC" },
          ].map((item, i) => (
            <OfferCard key={item.label} {...item} index={i} />
          ))}
        </div>

        <div className="mt-12 space-y-3 text-left">
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-zinc-500">
            <span>✨</span> Yang kita tawarin kakak:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Jasa website murah Rp300rb — landing page 1 halaman, free domain setahun, SSL gratis, online 2×24 jam",
              "Website UMKM & profil bisnis — pasang tombol WA, galeri produk, alamat, dan testimoni kakak",
              "Website personal branding & portofolio — cocok buat freelancer & content creator biar makin kredibel",
              "Jasa optimasi SEO & maintenance — backup rutin, update konten, bantu website kakak muncul di Google",
            ].map((item, i) => (
              <ServiceItem key={item} text={item} index={i} />
            ))}
          </div>
        </div>

        <p className="mt-10 text-sm font-bold text-zinc-400">
          Mau tanya2 dulu kakak?{" "}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            onClick={() => fetch("/api/track", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({eventType:"wa_click"}) }).catch(()=>{})}
            className="inline-flex items-center gap-1 text-pink font-black underline underline-offset-4"
          >
            Chat aja santai kakak ✨
          </a>
        </p>
      </div>
    </section>
  );
}
