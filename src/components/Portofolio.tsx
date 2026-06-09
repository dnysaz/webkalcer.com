"use client";

import { useEffect, useRef, useState } from "react";

function PortfolioCard({ title, tag, url, index }: { title: string; tag: string; url?: string; index: number }) {
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

  const Wrapper = url ? "a" : "div";
  const wrapperProps = url ? { href: url, target: "_blank", rel: "noopener" } : {};

  return (
    <div
      ref={ref}
      className={`group transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Wrapper {...wrapperProps} className={`relative overflow-hidden rounded-2xl border-4 border-zinc-800 bg-white shadow-xl transition-transform group-hover:-translate-y-2 group-hover:shadow-2xl block ${url ? "cursor-pointer hover:border-pink" : ""}`}>
        <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-lime" />
        </div>
        <div className="p-5">
          <div className="mb-3 h-4 w-3/4 rounded-full bg-zinc-200" />
          <div className="mb-2 h-3 w-full rounded-full bg-zinc-100" />
          <div className="mb-2 h-3 w-5/6 rounded-full bg-zinc-100" />
          <div className="mb-4 h-3 w-4/6 rounded-full bg-zinc-100" />
          <div className="inline-block rounded-full bg-pink/10 px-3 py-1 text-xs font-black text-pink uppercase">
            {tag}
          </div>
        </div>
      </Wrapper>
      <p className="mt-3 text-center text-sm font-black text-dark">{title}</p>
    </div>
  );
}

export default function Portofolio({ items }: { items?: { id: number; title: string; tag: string; url?: string }[] }) {
  const portfolios = items?.length ? items : [];
  if (!portfolios.length) return null;
  return (
    <section id="portfolio" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-yellow/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-pink/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink/10 px-5 py-2 text-sm font-bold text-pink backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-pink" />
            contoh hasil karya kakak
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-dark sm:text-5xl">
            WEBSITE <span className="text-pink">JADI</span>
          </h2>
          <p className="mt-2 text-base font-bold text-dark/60">Ini contoh website kakak-kakak yang udah jadi.</p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {portfolios.map((p, i) => (
            <PortfolioCard key={p.id} title={p.title} tag={p.tag} url={p.url} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
