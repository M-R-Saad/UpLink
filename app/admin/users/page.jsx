"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UserTable from "../../../components/admin/UserTable";
import Spinner from "../../../components/ui/Spinner";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, search, role],
    queryFn: () => {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set("search", search);
      if (role) params.set("role", role);
      return fetch(`/api/users?${params}`).then((r) => r.json());
    },
  });

  const handlePageChange = (newPage, newSearch, newRole) => {
    setPage(newPage);
    if (newSearch !== undefined) setSearch(newSearch);
    if (newRole !== undefined) setRole(newRole);
  };

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
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Users</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Manage user accounts, roles, and status
        </p>
      </div>

      <UserTable
        users={data?.data || []}
        pagination={data?.pagination || {}}
        onPageChange={handlePageChange}
        onRefresh={() => qc.invalidateQueries({ queryKey: ["admin-users"] })}
      />
    </div>
  );
}
