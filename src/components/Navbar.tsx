"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/90 shadow-lg backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a
          href="/"
          className="flex items-center gap-2 text-3xl font-black tracking-tighter transition-all hover:scale-105 sm:text-4xl"
        >
          <span className="text-2xl text-yellow sm:text-3xl">🤙</span>
          <span><span className="text-dark">web</span><span className="rounded-lg bg-yellow text-dark">kalcer</span><span className="text-dark">.com</span></span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href="#price"
            className="hidden items-center gap-1 rounded-full px-5 py-2 text-sm font-bold text-dark hover:bg-pink/10 sm:flex"
          >
            Harga
            <span className="text-pink">↓</span>
          </a>
          <a
            href="https://wa.me/6285792721649?text=Halo%20kak%2C%20saya%20mau%20buat%20website%20di%20webkalcer.com%20%2C%20bisa%20dibantu%3F"
            target="_blank"
            rel="noopener"
            className="animate-pulse-glow rounded-full bg-pink px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-pink-dark hover:scale-105"
          >
            Chat Kak
          </a>
        </div>
      </div>
    </header>
  );
}
