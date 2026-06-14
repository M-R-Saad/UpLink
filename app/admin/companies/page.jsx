"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CompanyTable from "../../../components/admin/CompanyTable";
import Spinner from "../../../components/ui/Spinner";

export default function AdminCompaniesPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: () =>
      fetch("/api/companies?limit=100&includeAll=true")
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
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Companies</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Approve or reject company registrations
        </p>
      </div>

      <CompanyTable
        companies={data || []}
        onRefresh={() => qc.invalidateQueries({ queryKey: ["admin-companies"] })}
      />
    </div>
  );
}
