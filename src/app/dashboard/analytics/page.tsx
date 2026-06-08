import { getVisitCount, getRecentVisits, getDailyVisits, getClickCounts, getDailyClicks } from "@/lib/supabase/queries";
import AnalyticsChart from "@/components/AnalyticsChart";

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
  const visits = new Map<string, number>();
  const wa = new Map<string, number>();
  const email = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    visits.set(key, 0);
    wa.set(key, 0);
    email.set(key, 0);
  }
  for (const r of rows) {
    const key = r.created_at.slice(0, 10);
    if (r.event_type === "wa_click" && wa.has(key)) wa.set(key, wa.get(key)! + 1);
    if (r.event_type === "email_click" && email.has(key)) email.set(key, email.get(key)! + 1);
  }
  return { visits, wa, email };
}

export default async function AnalyticsPage() {
  const [count, visits, dailyRows, clickCounts, clickRows] = await Promise.all([
    getVisitCount(),
    getRecentVisits(),
    getDailyVisits(14),
    getClickCounts(),
    getDailyClicks(14),
  ]);

  const visitsByDate = groupByDate(dailyRows, 14);
  const clickGroups = groupClicksByDate(clickRows, 14);
  const chartData = Array.from(visitsByDate.entries()).map(([date, v]) => ({
    date: date.slice(5),
    visits: v,
    wa_clicks: clickGroups.wa.get(date) ?? 0,
    email_clicks: clickGroups.email.get(date) ?? 0,
  }));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-black tracking-tighter text-dark">Analytics</h1>
      <p className="mt-1 mb-10 text-sm font-bold text-zinc-400">Monitor homepage visits and interactions.</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-orange/20 bg-white p-6 shadow-sm">
          <div className="text-3xl font-black text-pink">{count}</div>
          <div className="mt-1 text-sm font-bold text-zinc-500">Total Visits</div>
        </div>
        <div className="rounded-2xl border-2 border-orange/20 bg-white p-6 shadow-sm">
          <div className="text-3xl font-black text-green-500">{clickCounts.waClicks}</div>
          <div className="mt-1 text-sm font-bold text-zinc-500">WA Clicks</div>
        </div>
        <div className="rounded-2xl border-2 border-orange/20 bg-white p-6 shadow-sm">
          <div className="text-3xl font-black text-blue-500">{clickCounts.emailClicks}</div>
          <div className="mt-1 text-sm font-bold text-zinc-500">Email Clicks</div>
        </div>
      </div>

      <div className="mt-8">
        <AnalyticsChart data={chartData} />
      </div>

      <div className="mt-8">
        <h2 className="text-base font-black text-dark">Recent Visits</h2>
        {visits.length === 0 && <p className="mt-4 text-sm font-bold text-zinc-400">No visits yet.</p>}
        <div className="mt-4 space-y-2">
          {visits.map((v, i) => (
            <div key={v.id} className="flex items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-5 py-3 text-sm">
              <span className="font-bold text-zinc-600">#{i + 1}</span>
              <span className="text-xs text-zinc-500">{v.visitor_id || "—"}</span>
              <span className="text-xs text-zinc-400">{v.country ? `🌍 ${v.country}` : ""}</span>
              <span className="text-xs text-zinc-400">{new Date(v.visited_at).toLocaleString("id-ID")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
