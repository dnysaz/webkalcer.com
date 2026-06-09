"use client";

import { useEffect, useRef, useState } from "react";

const techs = [
  { name: "Next.js", emoji: "⚡", desc: "React framework" },
  { name: "React.js", emoji: "⚛️", desc: "UI library" },
  { name: "Vue.js", emoji: "💚", desc: "Frontend framework" },
  { name: "Supabase", emoji: "🔥", desc: "Backend & database" },
  { name: "Laravel", emoji: "🎯", desc: "PHP framework" },
  { name: "PHP", emoji: "🐘", desc: "Server language" },
  { name: "MySQL", emoji: "🗄️", desc: "Relational database" },
  { name: "SQLite", emoji: "📦", desc: "Embedded database" },
  { name: "Vercel", emoji: "▲", desc: "Cloud hosting" },
  { name: "VPS Profesional", emoji: "🖥️", desc: "Professional hosting" },
];

function TechCard({ name, emoji, desc, index }: { name: string; emoji: string; desc: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group flex flex-col items-center rounded-2xl border-2 border-zinc-700 bg-dark p-4 text-center shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-pink/50 hover:shadow-xl ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <span className="text-3xl transition-transform group-hover:scale-110">{emoji}</span>
      <span className="mt-2 text-sm font-black tracking-tight text-white">{name}</span>
      <span className="mt-0.5 text-[11px] font-bold text-zinc-500">{desc}</span>
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="relative overflow-hidden bg-dark px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-pink/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal/5 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-zinc-100 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow" />
            tech stack profesional
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl">
            Teknologi <span className="text-pink">Kami</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base font-bold leading-relaxed text-zinc-400">
            Dari frontend sampai hosting, kami pake teknologi yang udah teruji biar hasilnya maksimal.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {techs.map((t, i) => (
            <TechCard key={t.name} {...t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
