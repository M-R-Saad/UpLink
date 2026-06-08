"use client";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Textarea = forwardRef(function Textarea({ label, error, hint, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-xl border px-3 py-2 text-sm resize-none transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
          error ? "border-red-400" : "border-[var(--border)]",
          "bg-[var(--bg-card)] text-[var(--text)] placeholder:text-[var(--text-mute)]",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs" style={{ color: "var(--text-mute)" }}>{hint}</p>}
    </div>
  );
});

export default Textarea;
