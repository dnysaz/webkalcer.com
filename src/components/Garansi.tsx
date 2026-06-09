"use client";

import { useEffect, useRef, useState } from "react";

function GaransiCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

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
      className={`group rounded-2xl border-2 border-orange/20 bg-white p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-pink/50 hover:shadow-xl sm:p-8 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-4xl transition-transform group-hover:scale-110">{icon}</div>
      <div className="mt-3 text-lg font-black text-dark">{title}</div>
      <div className="mt-1 text-sm font-bold leading-relaxed text-zinc-500">{desc}</div>
    </div>
  );
}

const garansi = [
  { icon: "🔒", title: "Garansi Uang Kembali", desc: "Kalau websitenya batal jadi, uang kakak kembali 100%. Tenang aja." },
  { icon: "🔧", title: "Garansi Revisi", desc: "Ganti teks, warna, atau foto kakak — kami layani dengan cepat." },
  { icon: "🤝", title: "Support Santai", desc: "Bebas tanya kapan aja lewat WhatsApp. Kakak ga bakal diemin." },
];

export default function Garansi() {
  return (
    <section id="garansi" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute top-1/2 -left-40 h-72 w-72 rounded-full bg-teal/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-yellow/5 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow/20 px-5 py-2 text-sm font-bold text-dark backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow" />
            tenang aja kakak, ada jaminan
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-dark sm:text-5xl">
            DIJAMIN <span className="text-pink">AMAN</span>
          </h2>
          <p className="mt-2 text-base font-bold text-dark/60">Kakak ga perlu khawatir, kita jamin semuanya beres.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {garansi.map((g, i) => (
            <GaransiCard key={g.title} {...g} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
