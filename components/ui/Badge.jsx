import { cn } from "../../lib/utils";

const variants = {
  default:     "bg-[var(--bg-muted)] text-[var(--text-sub)]",
  accent:      "bg-[var(--accent-soft)] text-[var(--accent)]",
  green:       "bg-green-100 text-green-700",
  blue:        "bg-blue-100 text-blue-700",
  yellow:      "bg-yellow-100 text-yellow-700",
  red:         "bg-red-100 text-red-700",
  purple:      "bg-purple-100 text-purple-700",
  cyan:        "bg-cyan-100 text-cyan-700",
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
