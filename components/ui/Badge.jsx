import { cn } from "../../lib/utils";

const variants = {
  default:     "bg-[var(--bg-muted)] text-[var(--text-sub)]",
  accent:      "bg-[var(--accent-soft)] text-[var(--accent)]",
  green:       "bg-[var(--badge-green-soft)] text-[var(--badge-green)]",
  blue:        "bg-[var(--badge-blue-soft)] text-[var(--badge-blue)]",
  yellow:      "bg-[var(--badge-yellow-soft)] text-[var(--badge-yellow)]",
  red:         "bg-[var(--badge-red-soft)] text-[var(--badge-red)]",
  purple:      "bg-[var(--badge-purple-soft)] text-[var(--badge-purple)]",
  cyan:        "bg-[var(--badge-cyan-soft)] text-[var(--badge-cyan)]",
};

const JOB_TYPE_VARIANTS = {
  "full-time":   "green",
  "part-time":   "blue",
  "contract":    "yellow",
  "internship":  "purple",
  "freelance":   "cyan",
};

const LOCATION_VARIANTS = {
  "remote": "accent",
  "hybrid": "blue",
  "onsite": "default",
};

const APP_STATUS_VARIANTS = {
  "pending":     "yellow",
  "reviewed":    "blue",
  "shortlisted": "accent",
  "interview":   "purple",
  "hired":       "green",
  "rejected":    "red",
};

export function getJobTypeBadge(type) { return JOB_TYPE_VARIANTS[type] || "default"; }
export function getLocationBadge(type) { return LOCATION_VARIANTS[type] || "default"; }
export function getAppStatusBadge(status) { return APP_STATUS_VARIANTS[status] || "default"; }

export default function Badge({ children, variant = "default", className }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
