"use client";

import { EMAIL as ENV_EMAIL } from "@/lib/config";

export default function Footer({ email }: { email?: string }) {
  const contactEmail = email || ENV_EMAIL;
  return (
    <footer className="bg-dark px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-sm sm:flex-row">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <a href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
            <span className="text-yellow">🤙</span>
            <span><span className="text-white">web</span><span className="rounded-lg bg-yellow text-dark">kalcer</span><span className="text-white">.com</span></span>
          </a>
          <a
            href="https://www.instagram.com/webkalcer/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink hover:border-pink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Ikuti instagram kita kakak
          </a>
        </div>
        <div className="flex flex-col items-center gap-1 text-center sm:items-end">
          <a
            href={`mailto:${contactEmail}`}
            onClick={() => fetch("/api/track", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({eventType:"email_click"}) }).catch(()=>{})}
            className="font-bold text-zinc-300 underline underline-offset-2 hover:text-pink transition-colors"
          >
            {contactEmail}
          </a>
          <p className="font-bold text-zinc-500">
            Jual website, bukan jasa koding kakak. &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
