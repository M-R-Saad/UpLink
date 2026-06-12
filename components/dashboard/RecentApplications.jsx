"use client";
import Link from "next/link";
import ApplicationCard from "./ApplicationCard";
import { FiArrowRight } from "react-icons/fi";

export default function RecentApplications({ applications = [] }) {
  const recent = applications.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="p-6 rounded-2xl border text-center"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-mute)" }}>
          No applications yet. Start browsing jobs to apply!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold" style={{ color: "var(--text)" }}>Recent Applications</h2>
        <Link
          href="/dashboard/applications"
          className="flex items-center gap-1 text-xs font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          View all <FiArrowRight size={12} />
        </Link>
      </div>
      <div className="space-y-3">
        {recent.map((app) => (
          <ApplicationCard key={app._id} application={app} />
        ))}
      </div>
    </div>
  );
}
