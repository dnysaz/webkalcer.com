"use client";

import { useRef, useEffect, useState } from "react";

function BenefitCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    const timeout = setTimeout(() => setVisible(true), 3000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-3xl border-2 border-teal/20 bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-pink/40 hover:shadow-xl ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-5 text-4xl">
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-tight text-dark">{title}</h3>
      <p className="mt-3 text-sm font-bold leading-relaxed text-dark/70">{desc}</p>
    </div>
  );
}

const benefits = [
  {
    icon: "🚀",
    title: "Platform Siap Pakai",
    desc: "Website diserahkan dalam kondisi 100% aktif dan siap digunakan untuk operasional bisnis, lengkap dengan halaman utama, profil, dan kontak.",
  },
  {
    icon: "💻",
    title: "Bukan Sekadar Source Code",
    desc: "Anda tidak perlu pusing memikirkan cara instalasi, deployment, atau konfigurasi database. Kami yang tangani seluruh proses teknisnya.",
  },
  {
    icon: "✅",
    title: "Sistem yang Teruji",
    desc: "Kami memastikan performa website optimal, responsif di handphone maupun desktop, dan siap diakses oleh publik tanpa kendala teknis.",
  },
  {
    icon: "🎯",
    title: "SEO Tujuan Utama",
    desc: "Kami selalu mengoptimalkan SEO pada title dan description website agar mudah ditemukan di mesin pencarian dan menjangkau lebih banyak pelanggan.",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="relative overflow-hidden bg-cream px-4 py-20 sm:px-6">
      <div className="pointer-events-none absolute top-1/2 -left-40 h-72 w-72 rounded-full bg-teal/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal/10 px-5 py-2 text-sm font-bold text-teal backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-teal" />
            beda sama yang lain
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-dark sm:text-5xl">
            Kenapa Pilih{' '}
            <span className="text-dark">web</span>
            <span className="rounded-xl bg-yellow px-1 text-dark">kalcer</span>
            <span className="text-dark">.com</span>
            ?
          </h2>
          <p className="mt-2 text-base font-bold text-dark/60">Bukan cuma kode — websitemu langsung jalan.</p>
        </div>
        <div className="mt-12 flex gap-4 overflow-x-auto px-4 pb-4 sm:grid sm:gap-6 sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 snap-x snap-mandatory scrollbar-hide">
          {benefits.map((b, i) => (
            <div key={b.title} className="w-[75vw] flex-shrink-0 snap-center sm:w-auto sm:flex-shrink sm:snap-none">
              <BenefitCard {...b} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
