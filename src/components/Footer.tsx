"use client";

import { EMAIL as ENV_EMAIL } from "@/lib/config";

export default function Footer({ email }: { email?: string }) {
  const contactEmail = email || ENV_EMAIL;
  return (
    <footer className="bg-dark px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <a href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
          <span className="text-yellow">🤙</span>
          <span><span className="text-white">web</span><span className="rounded-lg bg-yellow text-dark">kalcer</span><span className="text-white">.com</span></span>
        </a>
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
