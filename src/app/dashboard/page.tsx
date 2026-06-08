import { createClient } from "@/lib/supabase/server";
import { getVisitCount, getDailyVisits, getDailyClicks, getClickCounts } from "@/lib/supabase/queries";
import AnalyticsChart from "@/components/AnalyticsChart";

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
}

function groupByDate(rows: { visited_at: string }[], days: number) {
  const map = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    map.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of rows) {
    const key = r.visited_at.slice(0, 10);
    if (map.has(key)) map.set(key, map.get(key)! + 1);
  }
  return map;
}

function groupClicksByDate(rows: { event_type: string; created_at: string }[], days: number) {
  const wa = new Map<string, number>();
  const email = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    wa.set(key, 0);
    email.set(key, 0);
  }
  for (const r of rows) {
    const key = r.created_at.slice(0, 10);
    if (r.event_type === "wa_click" && wa.has(key)) wa.set(key, wa.get(key)! + 1);
    if (r.event_type === "email_click" && email.has(key)) email.set(key, email.get(key)! + 1);
  }
  return { wa, email };
}

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [
    { count: packageCount },
    { count: draftCount },
    { count: pendingCount },
    { count: paidCount },
    { count: cancelledCount },
    visitCount,
    dailyRows,
    clickRows,
    clickCounts,
  ] = await Promise.all([
    supabase.from("packages").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
    getVisitCount(),
    getDailyVisits(14),
    getDailyClicks(14),
    getClickCounts(),
  ]);

  const { data: paidInvoices } = await supabase
    .from("invoices")
    .select("grand_total")
    .eq("status", "paid");

  const totalRevenue = paidInvoices?.reduce((sum, inv) => sum + Number(inv.grand_total), 0) ?? 0;

  const visitsByDate = groupByDate(dailyRows, 14);
  const clickGroups = groupClicksByDate(clickRows, 14);
  const chartData = Array.from(visitsByDate.entries()).map(([date, v]) => ({
    date: date.slice(5),
    visits: v,
    wa_clicks: clickGroups.wa.get(date) ?? 0,
    email_clicks: clickGroups.email.get(date) ?? 0,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-black tracking-tighter text-dark">
        Dashboard
      </h1>
      <p className="mt-1 mb-8 text-sm font-bold text-zinc-400">
        Welcome back, {user?.email}
      </p>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-orange/20 bg-white p-5 shadow-sm">
          <div className="text-3xl font-black text-pink">{packageCount ?? 0}</div>
          <div className="mt-1 text-sm font-bold text-zinc-500">Total Packages</div>
        </div>
        <div className="rounded-2xl border-2 border-orange/20 bg-white p-5 shadow-sm">
          <div className="text-3xl font-black text-blue-500">{visitCount}</div>
          <div className="mt-1 text-sm font-bold text-zinc-500">Total Visits</div>
        </div>
        <div className="rounded-2xl border-2 border-orange/20 bg-white p-5 shadow-sm">
          <div className="text-3xl font-black text-green-500">{formatPrice(totalRevenue)}</div>
          <div className="mt-1 text-sm font-bold text-zinc-500">Total Revenue</div>
        </div>
      </div>

      {/* Invoice Status */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border-2 border-zinc-200 bg-white px-5 py-4">
          <div className="text-sm font-bold text-zinc-400">Draft</div>
          <div className="text-2xl font-black text-dark">{draftCount ?? 0}</div>
        </div>
        <div className="rounded-xl border-2 border-yellow/30 bg-white px-5 py-4">
          <div className="text-sm font-bold text-zinc-400">Pending</div>
          <div className="text-2xl font-black text-yellow-700">{pendingCount ?? 0}</div>
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-white px-5 py-4">
          <div className="text-sm font-bold text-zinc-400">Paid</div>
          <div className="text-2xl font-black text-green-600">{paidCount ?? 0}</div>
        </div>
        <div className="rounded-xl border-2 border-red-200 bg-white px-5 py-4">
          <div className="text-sm font-bold text-zinc-400">Cancelled</div>
          <div className="text-2xl font-black text-red-400">{cancelledCount ?? 0}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8">
        <AnalyticsChart data={chartData} />
      </div>
    </div>
  );
}
