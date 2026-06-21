"use client";
import { cn } from "../../lib/utils";

const variants = {
  primary:   "bg-[var(--accent)] hover:opacity-90 text-white accent-glow",
  secondary: "bg-[var(--bg-muted)] hover:bg-[var(--border)] text-[var(--text)]",
  outline:   "border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] bg-transparent",
  ghost:     "hover:bg-[var(--bg-muted)] text-[var(--text)] bg-transparent",
  danger:    "bg-red-500 hover:bg-red-600 text-white",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2 text-sm rounded-xl",
  lg: "px-7 py-3 text-base rounded-xl",
};

export default function Button({
  children, variant = "primary", size = "md",
  className, disabled, loading, fullWidth, onClick, type = "button", ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
