"use client";
import { useSavedJobs, useSaveJob } from "../../../hooks/useSavedJobs";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import Badge, { getJobTypeBadge } from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { FiBookmark, FiMapPin, FiClock, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { formatSalary, formatDate } from "../../../lib/utils";

export default function SavedPage() {
  const { savedJobs, isLoading } = useSavedJobs();
  const { unsaveJob, isSaving } = useSaveJob();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Saved Jobs</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Jobs you&apos;ve bookmarked for later — {savedJobs.length} saved
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={FiBookmark}
          title="No saved jobs"
          description="Browse jobs and click the bookmark icon to save them for later"
          action={
            <Link href="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map(({ _id, job }) => {
            if (!job) return null;
            return (
              <div
                key={_id}
                className="p-5 rounded-2xl border transition hover:shadow-sm group"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start gap-3">
                  {/* Company logo */}
                  <div
                    className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold border"
                    style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--accent)" }}
                  >
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      job.company?.name?.[0] || "?"
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="text-sm font-semibold hover:underline line-clamp-1"
                      style={{ color: "var(--text)" }}
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-sub)" }}>
                      {job.company?.name}
                    </p>
                  </div>

                  {/* Unsave button */}
                  <button
                    type="button"
                    onClick={() => unsaveJob(job._id)}
                    disabled={isSaving}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition
                      hover:bg-red-500/10 text-red-400 hover:text-red-500"
                    title="Remove from saved"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant={getJobTypeBadge(job.jobType)}>{job.jobType}</Badge>
                  {job.location && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-mute)" }}>
                      <FiMapPin size={10} /> {job.location}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t"
                  style={{ borderColor: "var(--border)" }}>
                  <span className="text-xs font-medium" style={{ color: "var(--text-sub)" }}>
                    {formatSalary(job.salary)}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-mute)" }}>
                    <FiClock size={10} /> Closes {formatDate(job.deadline)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
