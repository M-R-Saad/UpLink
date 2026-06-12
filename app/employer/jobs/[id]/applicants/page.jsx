"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import ApplicantCard from "../../../../../components/employer/ApplicantCard";
import Spinner from "../../../../../components/ui/Spinner";
import EmptyState from "../../../../../components/ui/EmptyState";
import { FiUsers, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "reviewed", label: "Reviewed" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];

export default function ApplicantsPage() {
  const params = useParams();
  const jobId = params.id;
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function fetchApplicants() {
      try {
        // Fetch job details
        const jobRes = await fetch(`/api/jobs/${jobId}`);
        const jobJson = await jobRes.json();
        if (jobJson.success) setJobTitle(jobJson.data.title);

        // Fetch applicants — we'll query applications by job
        const res = await fetch(`/api/applications?jobId=${jobId}`);
        const json = await res.json();

        // The GET /api/applications is seeker-only, so we need a different approach
        // Let's fetch directly
        const appRes = await fetch(`/api/jobs/${jobId}/applicants`);
        const appJson = await appRes.json();
        if (appJson.success) {
          setApplicants(appJson.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = useCallback((appId, newStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );
  }, []);

  const filtered = activeTab === "all"
    ? applicants
    : applicants.filter((a) => a.status === activeTab);

  return (
    <div>
      <Link
        href="/employer/jobs"
        className="inline-flex items-center gap-1.5 text-sm mb-4 hover:opacity-70 transition"
        style={{ color: "var(--text-sub)" }}
      >
        <FiArrowLeft size={14} /> Back to Jobs
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Applicants
        </h1>
        {jobTitle && (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
            for <span className="font-medium">{jobTitle}</span> — {applicants.length} total
          </p>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
        style={{ background: "var(--bg-muted)" }}>
        {TABS.map(({ key, label }) => {
          const count = key === "all"
            ? applicants.length
            : applicants.filter((a) => a.status === key).length;
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#fff" : "var(--text-sub)",
              }}
            >
              {label}
              {count > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : "var(--border)",
                    color: active ? "#fff" : "var(--text-mute)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title={activeTab === "all" ? "No applicants yet" : `No ${activeTab} applicants`}
          description="Applicants will appear here when job seekers apply for this position"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicantCard
              key={app._id}
              application={app}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
