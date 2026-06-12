"use client";
import { FiFileText, FiBookmark, FiStar, FiUsers } from "react-icons/fi";

const CARDS = [
  { key: "applied", label: "Applied", icon: FiFileText, color: "#3b82f6" },
  { key: "saved", label: "Saved", icon: FiBookmark, color: "#f97316" },
  { key: "shortlisted", label: "Shortlisted", icon: FiStar, color: "#8b5cf6" },
  { key: "interview", label: "Interviews", icon: FiUsers, color: "#10b981" },
];

export default function StatsRow({ stats = {} }) {
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
