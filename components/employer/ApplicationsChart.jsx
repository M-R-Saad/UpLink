"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs shadow-lg border"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      <p className="font-medium" style={{ color: "var(--text)" }}>
        {label}
      </p>
      <p style={{ color: "var(--accent)" }}>
        {payload[0].value} application{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function ApplicationsChart({ data = [] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div
      className="p-5 rounded-2xl border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
        Applications — Last 14 Days
      </h3>

      {data.every((d) => d.count === 0) ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-sm" style={{ color: "var(--text-mute)" }}>
            No applications received in the last 14 days
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--text-mute)" }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, maxCount + 1]}
              tick={{ fontSize: 10, fill: "var(--text-mute)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-muted)", radius: 4 }} />
            <Bar
              dataKey="count"
              fill="var(--accent)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
