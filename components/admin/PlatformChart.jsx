"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs shadow-lg border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <p className="font-medium mb-1" style={{ color: "var(--text)" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function PlatformChart({ data = [] }) {
  return (
    <div
      className="p-5 rounded-2xl border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
        Platform Activity — Last 14 Days
      </h3>

      {data.every((d) => d.jobs === 0 && d.applications === 0) ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-sm" style={{ color: "var(--text-mute)" }}>
            No activity in the last 14 days
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "var(--text-mute)" }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "var(--text-mute)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="jobs" name="Jobs Posted" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={20} />
            <Bar dataKey="applications" name="Applications" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
