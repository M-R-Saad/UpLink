export default function JobCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border animate-pulse"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl flex-shrink-0" style={{ background: "var(--bg-muted)" }} />
        <div className="flex-1">
          <div className="h-3 rounded w-24 mb-1.5" style={{ background: "var(--bg-muted)" }} />
          <div className="h-4 rounded w-40" style={{ background: "var(--bg-muted)" }} />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 rounded-full" style={{ background: "var(--bg-muted)" }} />
        <div className="h-5 w-14 rounded-full" style={{ background: "var(--bg-muted)" }} />
      </div>
      <div className="h-3 rounded w-32 mt-3 pt-3 border-t" style={{ background: "var(--bg-muted)", borderColor: "var(--border)" }} />
    </div>
  );
}
