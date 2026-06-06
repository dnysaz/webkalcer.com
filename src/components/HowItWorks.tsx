"use client";

import { useRef, useEffect, useState } from "react";

function StepCard({ number, title, desc, index }: { number: string; title: string; desc: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    const timeout = setTimeout(() => setVisible(true), 3000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

  return (
    <div
      ref={ref}
      className={`group rounded-3xl border-2 border-zinc-700 bg-dark p-8 transition-all duration-500 hover:border-pink/50 hover:-translate-y-2 hover:shadow-2xl ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink text-2xl font-black text-white shadow-lg">
        {number}
      </div>
      <h3 className="text-2xl font-black tracking-tight text-white">{title}</h3>
      <p className="mt-3 text-base font-bold leading-relaxed text-zinc-200">{desc}</p>
    </div>
  );
}

const steps = [
  { number: "01", title: "KIRIM KONTEN", desc: "Foto, teks, logo — kirim aja lewat WhatsApp kakak. Ga ribet." },
  { number: "02", title: "KAMI BIKININ", desc: "Kami urus coding, domain, SSL, hosting. Kakak tinggal santai." },
  { number: "03", title: "WEBSITE ONLINE", desc: "Max 1-2 hari websitenya udah online. Tinggal kakak pake." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative overflow-hidden bg-dark px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-pink/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-teal/5 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-zinc-100 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime" />
            gampang banget kakak
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl">
            GINI <span className="text-yellow">CARANYA</span>
          </h2>
          <p className="mt-2 text-base font-bold text-zinc-200">Tiga langkah doang, websitenya jadi kakak.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <StepCard key={step.number} {...step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
