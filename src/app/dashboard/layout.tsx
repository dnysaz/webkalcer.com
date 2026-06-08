import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/hero", label: "Hero", icon: "🖋️" },
    { href: "/dashboard/testimonials", label: "Testimonials", icon: "💬" },
    { href: "/dashboard/portfolios", label: "Portfolio", icon: "🖼️" },
    { href: "/dashboard/seo", label: "SEO & Settings", icon: "🔍" },
    { href: "/dashboard/packages", label: "Packages", icon: "📦" },
    { href: "/dashboard/invoices", label: "Invoices", icon: "📄" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-200 bg-white shadow-sm">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6">
          <span className="text-yellow text-2xl">🤙</span>
          <span className="text-lg font-black tracking-tighter text-dark">dashboard</span>
        </div>
        <nav className="space-y-1 p-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-zinc-600 transition hover:bg-pink/5 hover:text-pink"
            >
              <span>{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 p-4">
          <div className="mb-2 truncate text-xs font-bold text-zinc-400">{user.email}</div>
          <form action={logout}>
            <button className="w-full rounded-full border-2 border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
              Logout
            </button>
          </form>
        </div>
      </aside>

      <main className="ml-64 flex-1 px-8 py-8">
        {children}
      </main>
    </div>
  );
}
