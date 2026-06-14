import Link from "next/link";
import { FiMapPin, FiClock, FiBriefcase } from "react-icons/fi";
import { formatSalary, formatDate, timeAgo } from "../../lib/utils";
import Badge, { getJobTypeBadge, getLocationBadge } from "../ui/Badge";

export default function CompanyJobsList({ jobs = [] }) {
  if (jobs.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-2xl border"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
      >
        <FiBriefcase size={36} className="mx-auto mb-3 opacity-20" style={{ color: "var(--text-sub)" }} />
        <p className="font-medium text-sm" style={{ color: "var(--text)" }}>
          No open positions
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
          This company hasn't posted any active jobs yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {jobs.map((job) => {
        const isExpiringSoon = new Date(job.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000;

        return (
          <Link
            key={job._id}
            href={`/jobs/${job._id}`}
            className="group flex flex-col p-5 rounded-2xl border transition hover:shadow-md hover:-translate-y-0.5 duration-200"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            {/* Title */}
            <h3
              className="font-semibold text-sm mb-2 group-hover:text-[var(--accent)] transition truncate"
              style={{ color: "var(--text)" }}
            >
              {job.title}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <Badge variant={getJobTypeBadge(job.jobType)} className="capitalize">
                {job.jobType?.replace("-", " ")}
              </Badge>
              <Badge variant={getLocationBadge(job.locationType)} className="capitalize">
                {job.locationType}
              </Badge>
              {job.experience !== "any" && (
                <Badge variant="default" className="capitalize">
                  {job.experience}
                </Badge>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between mt-auto pt-3 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                {job.location && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-mute)" }}>
                    <FiMapPin size={10} />
                    {job.location}
                  </span>
                )}
                <span className="text-xs font-medium" style={{ color: "var(--text-sub)" }}>
                  {formatSalary(job.salary)}
                </span>
              </div>
              <span
                className={`flex items-center gap-1 text-xs ${isExpiringSoon ? "text-red-400" : ""}`}
                style={isExpiringSoon ? {} : { color: "var(--text-mute)" }}
              >
                <FiClock size={10} />
                {isExpiringSoon ? `Closes ${formatDate(job.deadline)}` : timeAgo(job.createdAt)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
