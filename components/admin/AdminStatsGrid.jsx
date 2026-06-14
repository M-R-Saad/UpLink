"use client";
import { FiUsers, FiBriefcase, FiHome, FiFileText, FiStar, FiAlertCircle } from "react-icons/fi";

const CARDS = [
  { key: "totalUsers", label: "Total Users", icon: FiUsers, color: "#3b82f6" },
  { key: "totalJobs", label: "Total Jobs", icon: FiBriefcase, color: "#10b981" },
  { key: "totalCompanies", label: "Companies", icon: FiHome, color: "#8b5cf6" },
  { key: "totalApplications", label: "Applications", icon: FiFileText, color: "#f97316" },
  { key: "totalReviews", label: "Reviews", icon: FiStar, color: "#eab308" },
  { key: "pendingCompanies", label: "Pending Approval", icon: FiAlertCircle, color: "#ef4444" },
];

export default function AdminStatsGrid({ stats = {} }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
