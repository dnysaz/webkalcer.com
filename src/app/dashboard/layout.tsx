import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/dashboard/hero", label: "Hero", icon: "PenTool" },
    { href: "/dashboard/testimonials", label: "Testimonials", icon: "MessageSquare" },
    { href: "/dashboard/portfolios", label: "Portfolio", icon: "Image" },
    { href: "/dashboard/seo", label: "SEO & Settings", icon: "Search" },
    { href: "/dashboard/packages", label: "Packages", icon: "Package" },
    { href: "/dashboard/proposals", label: "Proposals", icon: "ClipboardList" },
    { href: "/dashboard/invoices", label: "Invoices", icon: "FileText" },
  ];

  const userEmail = user.email ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 md:flex-row">
      <MobileSidebar links={links} userEmail={userEmail} />
      <DesktopSidebar links={links} userEmail={userEmail} />
      <main className="flex-1 px-4 py-4 md:ml-64 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
