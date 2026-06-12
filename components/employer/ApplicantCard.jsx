"use client";
import { useState } from "react";
import ApplicantStatusSelect from "./ApplicantStatusSelect";
import Badge, { getAppStatusBadge } from "../ui/Badge";
import { FiDownload, FiChevronDown, FiChevronUp, FiMail } from "react-icons/fi";
import { timeAgo } from "../../lib/utils";
import toast from "react-hot-toast";

export default function ApplicantCard({ application, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { applicant, resumeURL, coverLetter, status, createdAt, statusHistory } = application;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${application._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Status updated to ${newStatus}`);
        if (onStatusChange) onStatusChange(application._id, newStatus);
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className="p-5 rounded-2xl border transition"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {applicant?.photoURL ? (
            <img src={applicant.photoURL} alt={applicant.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            applicant?.name?.[0]?.toUpperCase() || "?"
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {applicant?.name || "Applicant"}
          </p>
          <p className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "var(--text-sub)" }}>
            <FiMail size={10} /> {applicant?.email}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
            Applied {timeAgo(createdAt)}
          </p>
        </div>

        {/* Status select */}
        <ApplicantStatusSelect
          value={status}
          onChange={handleStatusChange}
          disabled={updating}
        />
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
        {resumeURL && resumeURL !== "null" && (
          <a
            href={resumeURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
              hover:bg-[var(--bg-muted)]"
            style={{ color: "var(--accent)" }}
          >
            <FiDownload size={12} /> Resume
          </a>
        )}

        {coverLetter && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition
              hover:bg-[var(--bg-muted)]"
            style={{ color: "var(--text-sub)" }}
          >
            {expanded ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
            Cover Letter
          </button>
        )}
      </div>

      {/* Expanded cover letter */}
      {expanded && coverLetter && (
        <div className="mt-3 p-4 rounded-xl text-sm leading-relaxed"
          style={{ background: "var(--bg-muted)", color: "var(--text-sub)" }}>
          {coverLetter}
        </div>
      )}

      {/* Status history */}
      {statusHistory && statusHistory.length > 1 && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-mute)" }}>
            Timeline
          </p>
          <div className="flex flex-wrap gap-2">
            {statusHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-1">
                <Badge variant={getAppStatusBadge(h.status)}>{h.status}</Badge>
                {i < statusHistory.length - 1 && (
                  <span className="text-xs" style={{ color: "var(--text-mute)" }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
