"use client";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Select = forwardRef(function Select({ label, error, children, className, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</label>}
      <select
        ref={ref}
        className={cn(
          "w-full rounded-xl border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
          error ? "border-red-400" : "border-[var(--border)]",
          "bg-[var(--bg-card)] text-[var(--text)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Select;
