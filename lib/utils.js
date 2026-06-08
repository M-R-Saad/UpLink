import slugify from "slugify";

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatSalary(salary) {
  if (!salary) return "Not disclosed";
  if (salary.isUndisclosed) return "Competitive Salary";
  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n;
  const min = salary.min ? fmt(salary.min) : null;
  const max = salary.max ? fmt(salary.max) : null;
  const currency = salary.currency || "BDT";
  const period = salary.period || "monthly";
  if (min && max) return `${currency} ${min} – ${max} / ${period}`;
  if (min) return `${currency} ${min}+ / ${period}`;
  return "Negotiable";
}

export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

export function generateSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

export function generateJobSlug(title) {
  const base = generateSlug(title);
  const id = Math.random().toString(36).substring(2, 8);
  return `${base}-${id}`;
}

export function truncate(str, n) {
  return str?.length > n ? str.substring(0, n) + "..." : str;
}
