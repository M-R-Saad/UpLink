"use client";
import { cn } from "../../lib/utils";

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "w-8 h-8 rounded-lg text-sm font-medium transition",
            p === page
              ? "text-white"
              : "hover:bg-[var(--bg-muted)]"
          )}
          style={p === page ? { background: "var(--accent)" } : { color: "var(--text-sub)" }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
