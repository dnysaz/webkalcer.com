"use client";

import { useEffect, useRef, useState } from "react";

function TestiCard({ quote, name, role, index }: { quote: string; name: string; role: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

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
      className={`group rounded-3xl border-2 border-zinc-700 bg-dark p-6 transition-all duration-500 hover:border-pink/50 hover:-translate-y-2 hover:shadow-2xl sm:p-8 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-4 flex gap-1 text-lg text-yellow">
        <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
      </div>
      <p className="text-base font-bold leading-relaxed text-zinc-200">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5 flex items-center gap-3 border-t border-zinc-700 pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink text-sm font-black text-white">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-black text-white">{name}</div>
          <div className="text-xs font-bold text-zinc-300">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Testimoni({ items }: { items?: { id: number; quote: string; name: string; role: string }[] }) {
  const testimonials = items?.length ? items : [];
  if (!testimonials.length) return null;
  return (
    <section id="testimoni" className="relative overflow-hidden bg-dark px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-pink/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-zinc-100 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow" />
            kata kakak-kakak yang udah order
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl">
            TESTIMONI <span className="text-yellow">KAKAK</span>
          </h2>
          <p className="mt-2 text-base font-bold text-zinc-200">Cerita seru dari kakak-kakak yang udah puas.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <TestiCard key={t.id} quote={t.quote} name={t.name} role={t.role} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
