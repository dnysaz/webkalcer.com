"use client";

import { useEffect, useState } from "react";
import { buildWaUrl } from "@/lib/config";
import { PhoneCall, Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/pricelist", label: "Pricelist" },
  { href: "/#how", label: "Cara Kerja" },
  { href: "/#portfolio", label: "Portofolio" },
  { href: "/#testimoni", label: "Testimoni" },
  { href: "/#faq", label: "FAQ" },
];

export default function Navbar({ phone, waMessage }: { phone?: string; waMessage?: string }) {
  const waUrl = buildWaUrl(phone, waMessage);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        scrolled || menuOpen ? "bg-cream shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a
          href="/"
          className="flex items-center gap-2 text-3xl font-black tracking-tighter transition-all hover:scale-105 sm:text-4xl"
          onClick={close}
        >
          <span className="text-2xl text-yellow sm:text-3xl">🤙</span>
          <span><span className="text-dark">web</span><span className="rounded-lg bg-yellow text-dark">kalcer</span><span className="text-dark">.com</span></span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-dark transition hover:bg-pink/10"
            >
              {l.label}
            </a>
          ))}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            onClick={() => fetch("/api/track", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({eventType:"wa_click"}) }).catch(()=>{})}
            className="ml-2 animate-pulse-glow rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white transition-transform hover:bg-pink-dark hover:scale-105"
          >
            Chat Kak
          </a>
        </nav>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            onClick={() => fetch("/api/track", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({eventType:"wa_click"}) }).catch(()=>{})}
            className="animate-pulse-glow rounded-full bg-pink px-4 py-2 text-xs font-bold text-white transition-transform hover:bg-pink-dark"
          >
            Chat Kak
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-200 bg-white text-dark shadow-sm transition hover:border-pink"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 top-0 -z-10" onClick={close} />
          <nav className="border-t border-zinc-200 bg-cream px-4 pb-6 pt-2 shadow-xl sm:hidden">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="block rounded-2xl px-4 py-3 text-base font-bold text-dark transition hover:bg-pink/10"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
