import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import MobileSidebar from "./MobileSidebar";

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

  const userEmail = user.email ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 md:flex-row">
      {/* Mobile top bar */}
      <MobileSidebar links={links} userEmail={userEmail} />

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64 md:flex-col md:border-r md:border-zinc-200 md:bg-white md:shadow-sm">
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-6">
          <span className="text-yellow text-2xl">🤙</span>
          <span className="text-lg font-black tracking-tighter text-dark">dashboard</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
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
        <div className="border-t border-zinc-200 p-4">
          <div className="mb-2 truncate text-xs font-bold text-zinc-300">{userEmail}</div>
          <form action={logout}>
            <SubmitButton className="w-full rounded-full border-2 border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-600 transition hover:border-pink hover:text-pink">
              Logout
            </SubmitButton>
          </form>
        </div>
      </aside>

      <main className="flex-1 px-4 py-4 md:ml-64 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
