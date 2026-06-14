"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import JobTable from "../../../components/admin/JobTable";
import Spinner from "../../../components/ui/Spinner";

export default function AdminJobsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () =>
      fetch("/api/jobs?limit=100")
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
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Jobs</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Moderate job listings across the platform
        </p>
      </div>

      <JobTable
        jobs={data || []}
        onRefresh={() => qc.invalidateQueries({ queryKey: ["admin-jobs"] })}
      />
    </div>
  );
}
