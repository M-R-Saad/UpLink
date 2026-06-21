"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiEdit2, FiEyeOff, FiEye, FiTrash2, FiUsers, FiExternalLink, FiCalendar, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import Badge from "../../../components/ui/Badge";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { formatDate } from "../../../lib/utils";

const STATUS_VARIANT = {
  active: "green", paused: "yellow", closed: "red", draft: "default",
};

export default function ManageJobsPage() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      const res  = await fetch("/api/jobs/mine");
      const json = await res.json();
      if (json.success) setJobs(json.data);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleStatusToggle = async (job) => {
    const newStatus = job.status === "active" ? "paused" : "active";
    try {
      const res  = await fetch(`/api/jobs/${job._id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.message); return; }
      toast.success(`Job ${newStatus}`);
      fetchJobs();
    } catch { toast.error("Failed to update job"); }
  };

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      const res  = await fetch(`/api/jobs/${confirm.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) { toast.error(json.message); return; }
      toast.success("Job closed");
      setConfirm(null);
      fetchJobs();
    } catch { toast.error("Failed to close job"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>My Jobs</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>Manage your job listings</p>
        </div>
        <Link href="/employer/jobs/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
          style={{ background: "var(--accent)" }}>
          <FiPlus size={15} /> Post a Job
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-40 rounded-2xl animate-pulse"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          <p className="font-medium mb-1" style={{ color: "var(--text)" }}>No jobs posted yet</p>
          <p className="text-sm mb-4" style={{ color: "var(--text-sub)" }}>Post your first job to start receiving applications</p>
          <Link href="/employer/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--accent)" }}>
            <FiPlus size={14} /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="rounded-2xl border p-5 transition hover:shadow-md"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-3">
                  <h3 className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{job.title}</h3>
                  <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--text-mute)" }}>
                    {job.jobType} · {job.locationType}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[job.status]} className="capitalize flex-shrink-0">{job.status}</Badge>
              </div>

              {/* Info row */}
              <div className="flex flex-wrap gap-3 mb-4 text-xs" style={{ color: "var(--text-sub)" }}>
                {job.category?.name && (
                  <span className="flex items-center gap-1">
                    {job.category.icon} {job.category.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FiCalendar size={11} /> {formatDate(job.deadline)}
                </span>
              </div>

              {/* Applicants link */}
              <Link href={`/employer/jobs/${job._id}/applicants`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold mb-4 px-3 py-1.5 rounded-lg transition hover:opacity-80"
                style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
                <FiUsers size={12} />
                {job.applicationCount} applicant{job.applicationCount !== 1 ? "s" : ""}
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-1 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
                <Link href={`/jobs/${job._id}`} target="_blank"
                  className="p-2 rounded-lg transition hover:bg-[var(--bg-muted)]"
                  style={{ color: "var(--text-sub)" }} title="View public listing">
                  <FiExternalLink size={14} />
                </Link>
                <Link href={`/employer/jobs/${job._id}/edit`}
                  className="p-2 rounded-lg transition hover:bg-[var(--bg-muted)]"
                  style={{ color: "var(--text-sub)" }} title="Edit">
                  <FiEdit2 size={14} />
                </Link>
                {(job.status === "active" || job.status === "paused") && (
                  <button onClick={() => handleStatusToggle(job)}
                    className="p-2 rounded-lg transition hover:bg-[var(--bg-muted)]"
                    style={{ color: "var(--text-sub)" }}
                    title={job.status === "active" ? "Pause" : "Unpause"}>
                    {job.status === "active" ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                )}
                <button onClick={() => setConfirm({ id: job._id })}
                  className="p-2 rounded-lg transition hover:bg-red-50 text-red-400 ml-auto"
                  title="Close job">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        title="Close this job?"
        message="This will hide the job from public listings."
        confirmLabel="Close Job"
      />
    </div>
  );
}
