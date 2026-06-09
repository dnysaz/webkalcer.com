"use client";

import { useEffect, useRef, useState } from "react";

interface Tech {
  name: string;
  icon: string;
  isSvg?: boolean;
  desc: string;
}

const techs: Tech[] = [
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/white", desc: "React framework" },
  { name: "React.js", icon: "https://cdn.simpleicons.org/react/white", desc: "UI library" },
  { name: "Vue.js", icon: "https://cdn.simpleicons.org/vuedotjs/white", desc: "Frontend framework" },
  { name: "Supabase", icon: "https://cdn.simpleicons.org/supabase/white", desc: "Backend & database" },
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/white", desc: "PHP framework" },
  { name: "PHP", icon: "https://cdn.simpleicons.org/php/white", desc: "Server language" },
  { name: "MySQL", icon: "https://cdn.simpleicons.org/mysql/white", desc: "Relational database" },
  { name: "SQLite", icon: "https://cdn.simpleicons.org/sqlite/white", desc: "Embedded database" },
  { name: "Vercel", icon: "https://cdn.simpleicons.org/vercel/white", desc: "Cloud hosting" },
  {
    name: "VPS Profesional",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/><line x1="6" y1="17" x2="6" y2="20"/><line x1="18" y1="17" x2="18" y2="20"/><line x1="12" y1="10" x2="12" y2="13"/><line x1="9" y1="10" x2="15" y2="10"/></svg>`,
    isSvg: true,
    desc: "Professional hosting",
  },
];

function TechCard({ name, icon, isSvg, desc, index }: Tech & { index: number }) {
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
      <div className="flex h-9 w-9 items-center justify-center transition-transform group-hover:scale-110">
        {isSvg ? (
          <span className="h-7 w-7" dangerouslySetInnerHTML={{ __html: icon }} />
        ) : (
          <img src={icon} alt={name} className="h-7 w-7" loading="lazy" />
        )}
      </div>
      <span className="mt-2 text-sm font-black tracking-tight text-white">{name}</span>
      <span className="mt-0.5 text-[11px] font-bold text-zinc-300">{desc}</span>
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
          <p className="mx-auto mt-3 max-w-xl text-base font-bold leading-relaxed text-zinc-300">
            Dari frontend sampai hosting, kami pake teknologi yang udah teruji biar hasilnya maksimal.
          </p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="mt-10 flex gap-3 overflow-x-auto md:hidden snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {techs.map((t, i) => (
            <div key={t.name} className="shrink-0 w-32 snap-start">
              <TechCard {...t} index={i} />
            </div>
          ))}
        </div>
        {/* Desktop: grid */}
        <div className="mt-10 hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {techs.map((t, i) => (
            <TechCard key={t.name} {...t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
