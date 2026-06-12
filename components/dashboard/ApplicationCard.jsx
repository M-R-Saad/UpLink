"use client";
import Link from "next/link";
import Badge, { getAppStatusBadge } from "../ui/Badge";
import { timeAgo } from "../../lib/utils";

export default function ApplicationCard({ application }) {
  const { job, status, createdAt, statusHistory } = application;

  return (
    <div
      className="p-4 rounded-2xl border transition hover:shadow-sm group"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start gap-3">
        {/* Company logo */}
        <div
          className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold border"
          style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--accent)" }}
        >
          {job?.company?.logo ? (
            <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
          ) : (
            job?.company?.name?.[0] || "?"
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/jobs/${job?._id || job?.slug}`}
            className="text-sm font-semibold hover:underline line-clamp-1"
            style={{ color: "var(--text)" }}
          >
            {job?.title || "Job"}
          </Link>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-sub)" }}>
            {job?.company?.name}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getAppStatusBadge(status)}>{status}</Badge>
            <span className="text-xs" style={{ color: "var(--text-mute)" }}>
              {timeAgo(createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Status history timeline (last 3) */}
      {statusHistory && statusHistory.length > 1 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-mute)" }}>
            Status History
          </p>
          <div className="space-y-1.5">
            {statusHistory.slice(-3).reverse().map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: i === 0 ? "var(--accent)" : "var(--border)" }}
                />
                <span className="text-xs capitalize" style={{ color: i === 0 ? "var(--text)" : "var(--text-mute)" }}>
                  {h.status}
                </span>
                <span className="text-xs" style={{ color: "var(--text-mute)" }}>
                  {timeAgo(h.changedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
