"use client";
import Link from "next/link";
import { FiUser, FiMail } from "react-icons/fi";
import Badge, { getAppStatusBadge } from "../ui/Badge";
import { timeAgo } from "../../lib/utils";

export default function RecentApplicants({ applicants = [] }) {
  if (applicants.length === 0) {
    return (
      <div
        className="p-5 rounded-2xl border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
          Recent Applicants
        </h3>
        <div className="flex items-center justify-center h-32">
          <p className="text-sm" style={{ color: "var(--text-mute)" }}>
            No applications yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-5 rounded-2xl border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Recent Applicants
        </h3>
      </div>

      <div className="space-y-3">
        {applicants.map((app) => (
          <div
            key={app._id}
            className="flex items-center gap-3 p-3 rounded-xl transition hover:bg-[var(--bg-muted)]"
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              {app.applicant?.image ? (
                <img
                  src={app.applicant.image}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                app.applicant?.name?.[0]?.toUpperCase() || <FiUser size={14} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
                {app.applicant?.name || "Applicant"}
              </p>
              <p className="text-xs truncate flex items-center gap-1" style={{ color: "var(--text-mute)" }}>
                Applied for{" "}
                <span className="font-medium" style={{ color: "var(--text-sub)" }}>
                  {app.job?.title || "a position"}
                </span>
              </p>
            </div>

            {/* Status & time */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={getAppStatusBadge(app.status)}>{app.status}</Badge>
              <span className="text-xs hidden sm:inline" style={{ color: "var(--text-mute)" }}>
                {timeAgo(app.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
