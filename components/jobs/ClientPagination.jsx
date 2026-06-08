"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClientPagination({ page, pages }) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p.toString());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => goToPage(p)}
          className="w-8 h-8 rounded-lg text-sm font-medium transition"
          style={{
            background: p === page ? "var(--accent)"      : "var(--bg-card)",
            color:      p === page ? "#fff"               : "var(--text-sub)",
            border:     `1px solid ${p === page ? "var(--accent)" : "var(--border)"}`,
          }}>
          {p}
        </button>
      ))}
    </div>
  );
}
