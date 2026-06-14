"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReviewTable from "../../../components/admin/ReviewTable";
import Spinner from "../../../components/ui/Spinner";

export default function AdminReviewsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () =>
      fetch("/api/admin/reviews")
        .then((r) => r.json())
        .then((j) => j.data || []),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Reviews</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Moderate company reviews
        </p>
      </div>

      <ReviewTable
        reviews={data || []}
        onRefresh={() => qc.invalidateQueries({ queryKey: ["admin-reviews"] })}
      />
    </div>
  );
}
