"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type ChartData = { date: string; visits: number; wa_clicks: number; email_clicks: number }[];

export default function AnalyticsChart({ data }: { data: ChartData }) {
  return (
    <div className="rounded-lg border-2 border-zinc-200 bg-white p-6">
      <h2 className="text-base font-black text-dark">Last 14 Days Chart</h2>
      <div className="mt-4 h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 700 }} stroke="#a1a1aa" />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fontWeight: 700 }} stroke="#a1a1aa" />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "2px solid #e4e4e7",
                fontSize: 12,
                fontWeight: 700,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="visits"
              name="Visits"
              stroke="#e93c7c"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="wa_clicks"
              name="WA Clicks"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="email_clicks"
              name="Email Clicks"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
