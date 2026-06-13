"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PenTool, MessageSquare, Search, Package, ClipboardList, FileText } from "lucide-react";
import { logout } from "./actions";
import SubmitButton from "@/components/SubmitButton";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={18} />,
  PenTool: <PenTool size={18} />,
  MessageSquare: <MessageSquare size={18} />,
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

export default function DesktopSidebar({ links, userEmail }: { links: NavLink[]; userEmail: string }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64 md:flex-col md:border-r md:border-zinc-200 md:bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6">
        <span className="text-yellow text-2xl">🤙</span>
        <span className="text-lg font-black tracking-tighter text-dark">dashboard</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {links.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition ${
                active
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
      <div className="border-t border-zinc-200 p-4">
        <div className="mb-2 truncate text-xs font-medium text-zinc-300">{userEmail}</div>
        <form action={logout}>
          <SubmitButton className="w-full rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 transition hover:border-pink hover:text-pink">
            Logout
          </SubmitButton>
        </form>
      </div>
    </aside>
  );
}
