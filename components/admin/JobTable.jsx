"use client";
import { useState } from "react";
import { FiStar, FiTrash2, FiExternalLink } from "react-icons/fi";
import Badge, { getJobTypeBadge } from "../ui/Badge";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

export default function JobTable({ jobs = [], onRefresh }) {
  const [updating, setUpdating] = useState(null);

  const handleToggleFeatured = async (jobId, isFeatured) => {
    setUpdating(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(isFeatured ? "Unfeatured" : "Featured!");
        onRefresh?.();
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (jobId) => {
    if (!confirm("Close this job listing?")) return;
    setUpdating(jobId);
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Job closed");
        onRefresh?.();
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Failed to remove");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ background: "var(--bg-card)" }}>
          <thead>
            <tr style={{ background: "var(--bg-muted)" }}>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Job Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Apps</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Posted</th>
              <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate max-w-[200px]" style={{ color: "var(--text)" }}>
                      {job.title}
                    </span>
                    {job.isFeatured && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>★</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs truncate" style={{ color: "var(--text-sub)" }}>
                  {job.company?.name || "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getJobTypeBadge(job.jobType)} className="capitalize">
                    {job.jobType?.replace("-", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={job.status === "active" ? "green" : job.status === "paused" ? "yellow" : "red"}>
                    {job.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text-sub)" }}>
                  {job.applicationCount || 0}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text-mute)" }}>
                  {formatDate(job.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a href={`/jobs/${job._id}`} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition hover:bg-[var(--bg-muted)]"
                      style={{ color: "var(--text-sub)" }} title="View">
                      <FiExternalLink size={13} />
                    </a>
                    <button
                      onClick={() => handleToggleFeatured(job._id, job.isFeatured)}
                      disabled={updating === job._id}
                      className="p-1.5 rounded-lg transition hover:bg-[var(--bg-muted)]"
                      style={{ color: job.isFeatured ? "#f59e0b" : "var(--text-mute)" }}
                      title={job.isFeatured ? "Unfeature" : "Feature"}
                    >
                      <FiStar size={13} fill={job.isFeatured ? "#f59e0b" : "none"} />
                    </button>
                    <button
                      onClick={() => handleRemove(job._id)}
                      disabled={updating === job._id}
                      className="p-1.5 rounded-lg transition hover:bg-red-50"
                      style={{ color: "#ef4444" }}
                      title="Close job"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm" style={{ color: "var(--text-mute)" }}>
                  No jobs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
