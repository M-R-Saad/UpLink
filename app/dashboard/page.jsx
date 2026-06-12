"use client";
import { useApplications } from "../../hooks/useApplications";
import { useSavedJobs } from "../../hooks/useSavedJobs";
import StatsRow from "../../components/dashboard/StatsRow";
import RecentApplications from "../../components/dashboard/RecentApplications";
import Spinner from "../../components/ui/Spinner";

export default function DashboardPage() {
  const { applications, statusCounts, isLoading } = useApplications();
  const { savedJobs } = useSavedJobs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = {
    applied: statusCounts.all || 0,
    saved: savedJobs.length,
    shortlisted: statusCounts.shortlisted || 0,
    interview: statusCounts.interview || 0,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Track your job search progress
        </p>
      </div>

      <div className="space-y-6">
        <StatsRow stats={stats} />
        <RecentApplications applications={applications} />
      </div>
    </div>
  );
}
