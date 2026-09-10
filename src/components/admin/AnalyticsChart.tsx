"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { DailyStat } from "@/lib/analytics";

export function AnalyticsChart({ data }: { data: DailyStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis
          dataKey="day"
          tick={{ fill: "#a6a6bd", fontSize: 11 }}
          tickFormatter={(d: string) => d.slice(5)}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#a6a6bd", fontSize: 11 }}
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#17172a",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 8,
            fontSize: 13,
          }}
          labelStyle={{ color: "#f0f0f5" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#a6a6bd" }} />
        <Line
          type="monotone"
          dataKey="views"
          name="Page views"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="visitors"
          name="Unique visitors"
          stroke="#ec4899"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
