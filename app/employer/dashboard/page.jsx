"use client";
import { useQuery } from "@tanstack/react-query";
import EmployerStatsRow from "../../../components/employer/EmployerStatsRow";
import ApplicationsChart from "../../../components/employer/ApplicationsChart";
import RecentApplicants from "../../../components/employer/RecentApplicants";
import Spinner from "../../../components/ui/Spinner";

function useEmployerStats() {
  return useQuery({
    queryKey: ["employer-stats"],
    queryFn: () =>
      fetch("/api/employer/stats")
        .then((r) => r.json())
        .then((j) => (j.success ? j.data : null)),
  });
}

export default function EmployerDashboard() {
  const { data, isLoading } = useEmployerStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = data || {};

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Employer Dashboard
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Overview of your hiring activity
        </p>
      </div>

      <div className="space-y-6">
        <EmployerStatsRow stats={stats} />
        <ApplicationsChart data={stats.applicationsByDay || []} />
        <RecentApplicants applicants={stats.recentApplicants || []} />
      </div>
    </div>
  );
}
