"use client";

import { useEffect, useRef, useState } from "react";

function StatCard({ num, label, index }: { num: string; label: string; index: number }) {
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
    const timeout = setTimeout(() => setVisible(true), 3000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border-2 border-orange/20 bg-white p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-pink/50 hover:shadow-xl ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-4xl font-black text-pink sm:text-5xl">{num}</div>
      <div className="mt-1 text-sm font-bold text-dark/70">{label}</div>
    </div>
  );
}

const stats = [
  { num: "50+", label: "Website Jadi" },
  { num: "98%", label: "Kepuasan Pelanggan" },
  { num: "100%", label: "Tanpa Ribet Coding" },
];

export default function Stats() {
  return (
    <section id="stats" className="relative overflow-hidden px-4 py-20 sm:px-6">
      <div className="pointer-events-none absolute top-1/2 -left-40 h-72 w-72 rounded-full bg-teal/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-pink/5 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink/10 px-5 py-2 text-sm font-bold text-pink backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-pink" />
            udah dipercaya kakak-kakak
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-dark sm:text-5xl">
            ANGKA <span className="text-pink">BICARA</span>
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
