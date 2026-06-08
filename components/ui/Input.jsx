"use client";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className, ...props }, ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium" style={{ color: "var(--text)" }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-mute)" }}>
            <Icon size={15} />
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
            Icon && "pl-9",
            error ? "border-red-400" : "border-[var(--border)]",
            "bg-[var(--bg-card)] text-[var(--text)] placeholder:text-[var(--text-mute)]",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs" style={{ color: "var(--text-mute)" }}>{hint}</p>}
    </div>
  );
});

export default Input;
