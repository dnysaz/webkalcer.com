"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";
import SubmitButton from "@/components/SubmitButton";
import { LayoutDashboard, PenTool, MessageSquare, Image, Search, Package, ClipboardList, FileText, Menu, X } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={18} />,
  PenTool: <PenTool size={18} />,
  MessageSquare: <MessageSquare size={18} />,
  // eslint-disable-next-line jsx-a11y/alt-text
  Image: <Image size={18} />,
  Search: <Search size={18} />,
  Package: <Package size={18} />,
  ClipboardList: <ClipboardList size={18} />,
  FileText: <FileText size={18} />,
};

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <span className="text-yellow text-xl">🤙</span>
          <span className="text-base font-black tracking-tighter text-dark">dashboard</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-dark transition hover:border-pink"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-200 px-6">
          <span className="text-yellow text-xl">🤙</span>
          <span className="text-base font-black tracking-tighter text-dark">dashboard</span>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {links.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-pink/10 font-bold text-pink"
                    : "font-medium text-zinc-500 hover:bg-pink/5 hover:text-pink"
                }`}
              >
                <span>{iconMap[l.icon]}</span>
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
