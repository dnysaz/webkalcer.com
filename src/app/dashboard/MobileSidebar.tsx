"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";
import SubmitButton from "@/components/SubmitButton";

interface NavLink {
  href: string;
  label: string;
  icon: string;
}

export default function MobileSidebar({ links, userEmail }: { links: NavLink[]; userEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Top bar with hamburger */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 shadow-sm md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-yellow text-xl">🤙</span>
          <span className="text-base font-black tracking-tighter text-dark">dashboard</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-zinc-200 text-dark transition hover:border-pink"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className={`text-xl font-black transition-transform ${open ? "rotate-45" : ""}`}>
            {open ? "+" : "☰"}
          </span>
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-200 px-6">
          <span className="text-yellow text-xl">🤙</span>
          <span className="text-base font-black tracking-tighter text-dark">dashboard</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {links.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-pink/10 text-pink"
                    : "text-zinc-600 hover:bg-pink/5 hover:text-pink"
                }`}
              >
                <span className="text-lg">{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 border-t border-zinc-200 p-4">
          <div className="mb-2 truncate text-xs font-bold text-zinc-300">{userEmail}</div>
          <form action={logout}>
            <SubmitButton className="w-full rounded-full border-2 border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
              Logout
            </SubmitButton>
          </form>
        </div>
      </aside>
    </>
  );
}
