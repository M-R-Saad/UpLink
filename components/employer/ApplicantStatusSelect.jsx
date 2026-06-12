"use client";
import { cn } from "../../lib/utils";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "#eab308" },
  { value: "reviewed", label: "Reviewed", color: "#3b82f6" },
  { value: "shortlisted", label: "Shortlisted", color: "#f97316" },
  { value: "interview", label: "Interview", color: "#8b5cf6" },
  { value: "hired", label: "Hired", color: "#22c55e" },
  { value: "rejected", label: "Rejected", color: "#ef4444" },
];

export default function ApplicantStatusSelect({ value, onChange, disabled }) {
  const current = STATUS_OPTIONS.find((s) => s.value === value);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-semibold capitalize",
          "border cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        style={{
          background: current ? `${current.color}15` : "var(--bg-muted)",
          color: current?.color || "var(--text-sub)",
          borderColor: current ? `${current.color}30` : "var(--border)",
        }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
