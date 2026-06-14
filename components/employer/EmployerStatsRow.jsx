"use client";
import { FiBriefcase, FiCheckCircle, FiUsers, FiTrendingUp } from "react-icons/fi";

const CARDS = [
  { key: "totalJobs", label: "Total Jobs", icon: FiBriefcase, color: "#3b82f6" },
  { key: "activeListings", label: "Active Listings", icon: FiCheckCircle, color: "#10b981" },
  { key: "totalApplicants", label: "Total Applicants", icon: FiUsers, color: "#8b5cf6" },
  { key: "applicationsThisWeek", label: "This Week", icon: FiTrendingUp, color: "#f97316" },
];

export default function EmployerStatsRow({ stats = {} }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="p-4 rounded-2xl border transition hover:shadow-sm"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}15`, color }}
            >
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                {stats[key] ?? 0}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--text-mute)" }}>
                {label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
