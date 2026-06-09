"use client";

import { useEffect, useRef, useState } from "react";
import { EMAIL, buildWaUrl } from "@/lib/config";

export default function CTA({ phone, email, waMessage }: { phone?: string; email?: string; waMessage?: string }) {
  const waUrl = buildWaUrl(phone, waMessage);
  const contactEmail = email || EMAIL;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-pink/10 blur-3xl" />

      <div
        ref={ref}
        className={`relative mx-auto max-w-3xl rounded-3xl bg-yellow p-10 text-center shadow-2xl transition-all duration-700 sm:p-16 ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-95 opacity-0"
        }`}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <span className="inline-block animate-float rounded-full bg-white px-6 py-2 text-sm font-black text-dark shadow-lg">
            🚀 YUK LAH
          </span>
        </div>

        <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-tighter sm:text-5xl">
          SIAP BIKIN
          <br />
          <span className="mt-2 inline-block -rotate-1 rounded-3xl bg-white px-6 py-2 text-dark shadow-xl sm:px-10">
            WEBSITE KAK? 🎉
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base font-bold leading-relaxed text-dark/80">
          Chat aja lewat WhatsApp atau email kakak. Konsultasi dulu aja, ga ada kewajiban beli.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener"
          onClick={() => fetch("/api/track", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({eventType:"wa_click"}) }).catch(()=>{})}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-pink px-10 py-4 text-base font-bold text-white shadow-lg transition-transform hover:bg-pink-dark hover:scale-105 hover:shadow-xl active:scale-95"
        >
          Chat WhatsApp Kak
          <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
        </a>
          <a
            href={`mailto:${contactEmail}`}
            onClick={() => fetch("/api/track", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({eventType:"email_click"}) }).catch(()=>{})}
            className="group mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white/50 bg-white px-8 py-3 text-base font-bold text-dark shadow-sm transition-transform hover:bg-white hover:scale-105 hover:shadow-lg active:scale-95"
          >
            {contactEmail} ✉️
          </a>
      </div>
    </section>
  );
}
