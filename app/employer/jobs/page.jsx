"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiEdit2, FiEyeOff, FiEye, FiTrash2, FiUsers, FiExternalLink } from "react-icons/fi";
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

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res  = await fetch("/api/jobs/mine");
      const json = await res.json();
      if (json.success) setJobs(json.data);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div key={i} className="h-20 rounded-2xl animate-pulse"
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
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <table className="w-full text-sm">
            <thead className="border-b" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
              <tr>
                {["Job Title","Category","Applications","Deadline","Status","Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-mute)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {jobs.map((job) => (
                <tr key={job._id} className="hover:opacity-80 transition">
                  <td className="px-5 py-4">
                    <p className="font-medium" style={{ color: "var(--text)" }}>{job.title}</p>
                    <p className="text-xs mt-0.5 capitalize" style={{ color: "var(--text-mute)" }}>
                      {job.jobType} · {job.locationType}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: "var(--text-sub)" }}>
                    {job.category?.icon} {job.category?.name}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/employer/jobs/${job._id}/applicants`}
                      className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                      style={{ color: "var(--accent)" }}>
                      <FiUsers size={12} />
                      {job.applicationCount} applicant{job.applicationCount !== 1 ? "s" : ""}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: "var(--text-sub)" }}>
                    {formatDate(job.deadline)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={STATUS_VARIANT[job.status]} className="capitalize">{job.status}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {/* View public listing */}
                      <Link href={`/jobs/${job._id}`} target="_blank"
                        className="p-1.5 rounded-lg transition hover:opacity-70"
                        style={{ color: "var(--text-sub)" }} title="View public listing">
                        <FiExternalLink size={14} />
                      </Link>
                      {/* Edit */}
                      <Link href={`/employer/jobs/${job._id}/edit`}
                        className="p-1.5 rounded-lg transition hover:opacity-70"
                        style={{ color: "var(--text-sub)" }} title="Edit">
                        <FiEdit2 size={14} />
                      </Link>
                      {/* Pause / Unpause */}
                      {(job.status === "active" || job.status === "paused") && (
                        <button onClick={() => handleStatusToggle(job)}
                          className="p-1.5 rounded-lg transition hover:opacity-70"
                          style={{ color: "var(--text-sub)" }}
                          title={job.status === "active" ? "Pause" : "Unpause"}>
                          {job.status === "active" ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                        </button>
                      )}
                      {/* Close */}
                      <button onClick={() => setConfirm({ id: job._id })}
                        className="p-1.5 rounded-lg transition hover:opacity-70 text-red-400"
                        title="Close job">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
