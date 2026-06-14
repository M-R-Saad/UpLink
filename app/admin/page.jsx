"use client";
import { useQuery } from "@tanstack/react-query";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import PlatformChart from "../../components/admin/PlatformChart";
import Spinner from "../../components/ui/Spinner";

function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () =>
      fetch("/api/admin/stats")
        .then((r) => r.json())
        .then((j) => (j.success ? j.data : null)),
  });
}

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

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
          Platform Overview
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Monitor and manage the entire platform
        </p>
      </div>

      <div className="space-y-6">
        <AdminStatsGrid stats={stats} />

        {/* Weekly highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "New Users This Week", value: stats.newUsersThisWeek, color: "#3b82f6" },
            { label: "New Jobs This Week", value: stats.newJobsThisWeek, color: "#10b981" },
            { label: "New Applications This Week", value: stats.newApplicationsThisWeek, color: "#f97316" },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-2xl border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--text-mute)" }}>{label}</p>
              <p className="text-xl font-bold" style={{ color }}>{value ?? 0}</p>
            </div>
          ))}
        </div>

        <PlatformChart data={stats.chartData || []} />
      </div>
    </div>
  );
}
