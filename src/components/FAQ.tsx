"use client";

import { useEffect, useRef, useState } from "react";

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [visible, setVisible] = useState(true);

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
    <details
      ref={ref}
      className={`group rounded-2xl border-2 border-zinc-700 bg-dark p-0 transition-all duration-500 hover:border-pink/40 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-bold uppercase tracking-tight text-white transition hover:text-pink sm:text-base">
        {q}
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink text-sm font-bold text-white shadow-lg transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-zinc-700 p-5 text-base font-bold leading-relaxed text-zinc-200">
        {a}
      </div>
    </details>
  );
}

const faqs = [
  { q: "SAYA GA NGERTI CODING KAKAK, BISA?", a: "Bisa banget kakak. Justru itu nilai jual kami — kakak ga perlu ngerti coding, domain, hosting, atau SSL. Kirim konten, kami urus sisanya." },
  { q: "BERAPA LAMA WEBSITENYA JADI KAKAK?", a: "Paket Website Profil selesai 2x24 jam kakak. Paket Admin Panel 3-5 hari. Web App 1-2 minggu tergantung kompleksitas." },
  { q: "DOMAIN DAN HOSTING GIMANA KAKAK?", a: "Semua paket udah include domain & hosting tahun pertama kakak. Tahun berikutnya kakak tinggal perpanjang sendiri atau kami bantu." },
  { q: "BISA MINTA REVISI KAKAK?", a: "Tentu kakak. Revisi minor (ganti teks, warna, foto) kami layani. Kalau ada perubahan besar atau tambah fitur, beda paket lagi kakak." },
  { q: "PAKET 300RB DAPET APA AJA KAKAK?", a: "Dapet 1 halaman landing page, domain 1 tahun, hosting Vercel, SSL, responsive, dan tombol WA. Cocok buat portofolio atau profil usaha kakak." },
  { q: "KENAPA MURAH KAKAK? APA KUALITASNYA?", a: "Kami pake teknologi modern yang profesional dan workflow terstruktur. Karena udah template jadi tinggal isi konten — prosesnya efisien, kualitas tetap profesional kok." },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden bg-dark px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-teal/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-pink/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-zinc-100 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow" />
            biar makin paham kakak
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl">FAQ</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} {...faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
