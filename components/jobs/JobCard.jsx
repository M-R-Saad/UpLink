"use client";
import Link from "next/link";
import { FiMapPin, FiClock, FiBookmark } from "react-icons/fi";
import { JobTypeTag, LocationTag } from "./JobTypeTag";
import SalaryRange from "./SalaryRange";
import { formatDate, timeAgo } from "../../lib/utils";

export default function JobCard({ job }) {
  const isExpiringSoon = new Date(job.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/jobs/${job._id}`}
      className="group flex flex-col p-5 rounded-2xl border transition hover:shadow-md hover:-translate-y-0.5 duration-200"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm border"
            style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--accent)" }}>
            {job.company?.logo
              ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
              : job.company?.name?.[0]
            }
          </div>
          <div className="min-w-0">
            <p className="text-xs truncate" style={{ color: "var(--text-sub)" }}>{job.company?.name}</p>
            <h3 className="font-semibold text-sm truncate group-hover:text-[var(--accent)] transition"
              style={{ color: "var(--text)" }}>
              {job.title}
            </h3>
          </div>
        </div>
        {job.isFeatured && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            Featured
          </span>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <JobTypeTag type={job.jobType} />
        <LocationTag type={job.locationType} />
        {job.experience !== "any" && (
          <span className="text-xs px-2 py-0.5 rounded-full capitalize"
            style={{ background: "var(--bg-muted)", color: "var(--text-sub)" }}>
            {job.experience}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t"
        style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          {job.company?.location && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-mute)" }}>
              <FiMapPin size={10} />{job.company.location}
            </span>
          )}
          <SalaryRange salary={job.salary} />
        </div>
        <span className={`flex items-center gap-1 text-xs ${isExpiringSoon ? "text-red-400" : ""}`}
          style={isExpiringSoon ? {} : { color: "var(--text-mute)" }}>
          <FiClock size={10} />
          {isExpiringSoon ? `Closes ${formatDate(job.deadline)}` : timeAgo(job.createdAt)}
        </span>
      </div>
    </Link>
  );
}
