"use client";

import { useEffect, useRef } from "react";

function Mockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="relative rounded-2xl border-4 border-zinc-800 bg-white shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-zinc-200 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-lime" />
          <div className="ml-3 flex-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-400">
            webkalcer.com
          </div>
        </div>
        <div className="p-5">
          <div className="mb-3 h-4 w-3/4 rounded-full bg-zinc-200" />
          <div className="mb-2 h-3 w-full rounded-full bg-zinc-100" />
          <div className="mb-2 h-3 w-5/6 rounded-full bg-zinc-100" />
          <div className="mb-4 h-3 w-4/6 rounded-full bg-zinc-100" />
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-lg bg-pink" />
            <div className="h-8 w-24 rounded-lg border-2 border-zinc-200" />
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border-4 border-pink/30 bg-pink/5" />
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      el.style.setProperty("--rx", `${x}deg`);
      el.style.setProperty("--ry", `${y}deg`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 sm:pt-36 sm:pb-28">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-pink/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />

      <span className="pointer-events-none absolute left-[10%] top-[20%] animate-float text-4xl opacity-20">✨</span>
      <span className="pointer-events-none absolute right-[15%] top-[15%] animate-float text-3xl opacity-20" style={{ animationDelay: "1s" }}>🚀</span>
      <span className="pointer-events-none absolute bottom-[25%] left-[5%] animate-float text-2xl opacity-20" style={{ animationDelay: "2s" }}>💻</span>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-block animate-float rounded-full bg-pink px-6 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-lg">
              ✨ Jual website, bukan jasa koding
            </div>

            <div ref={ref} style={{ transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))", transition: "transform 0.15s ease-out" }}>
              <h1 className="text-5xl font-black leading-tight tracking-tighter sm:text-6xl lg:text-7xl">
                Ingin punya website
                <br />
                pribadi / usaha
                <br />
                tapi
                <span className="text-pink"> ga mau ribet</span>?
              </h1>
              <p className="mx-auto mt-4 max-w-md text-xl font-bold leading-relaxed text-dark/70 sm:text-2xl lg:mx-0">
                <span className="mt-2 inline-block -rotate-1 rounded-3xl bg-pink px-6 text-white shadow-xl sm:px-10">
                  order di webkalcer aja! 🤙
                </span>
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="#price"
                className="rounded-full bg-pink px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-pink-dark hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Mulai dari 300rb ↓
              </a>
              <a
                href="https://wa.me/6285792721649?text=Halo%20kak%2C%20saya%20mau%20buat%20website%20di%20webkalcer.com%20%2C%20bisa%20dibantu%3F"
                target="_blank"
                rel="noopener"
                className="rounded-full border-2 border-pink/30 bg-white px-8 py-4 text-lg font-bold text-dark shadow-sm transition-all hover:border-pink hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Konsultasi Gratis
              </a>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm font-bold text-zinc-400 lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="text-lime">✓</span> Free Domain
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lime">✓</span> SSL Gratis
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lime">✓</span> 1x24 Jam
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <Mockup />
          </div>
        </div>
      </div>
    </section>
  );
}
