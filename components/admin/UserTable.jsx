"use client";
import { useState } from "react";
import { FiUser, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Badge from "../ui/Badge";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

const ROLE_VARIANTS = { jobseeker: "blue", employer: "purple", admin: "accent" };

export default function UserTable({ users = [], pagination = {}, onPageChange, onRefresh }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updating, setUpdating] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    onPageChange?.(1, search, roleFilter);
  };

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    onPageChange?.(1, search, role);
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Role updated");
        onRefresh?.();
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(isActive ? "User deactivated" : "User activated");
        onRefresh?.();
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-mute)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border outline-none"
              style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
        </form>
        <div className="flex items-center gap-1.5">
          {["", "jobseeker", "employer", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => handleRoleFilter(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition"
              style={{
                background: roleFilter === r ? "var(--accent)" : "var(--bg-muted)",
                color: roleFilter === r ? "#fff" : "var(--text-sub)",
              }}
            >
              {r || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ background: "var(--bg-card)" }}>
            <thead>
              <tr style={{ background: "var(--bg-muted)" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Joined</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name?.[0]?.toUpperCase() || <FiUser size={12} />
                        )}
                      </div>
                      <span className="font-medium truncate" style={{ color: "var(--text)" }}>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 truncate" style={{ color: "var(--text-sub)" }}>{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={updating === user._id}
                      className="px-2 py-1 rounded-lg text-xs border outline-none capitalize"
                      style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      <option value="jobseeker">Jobseeker</option>
                      <option value="employer">Employer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isActive ? "green" : "red"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-mute)" }}>
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggleActive(user._id, user.isActive)}
                      disabled={updating === user._id}
                      className="px-3 py-1 rounded-lg text-xs font-medium transition hover:bg-[var(--bg-muted)]"
                      style={{ color: user.isActive ? "#ef4444" : "#10b981" }}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm" style={{ color: "var(--text-mute)" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => onPageChange?.(pagination.page - 1, search, roleFilter)}
            disabled={pagination.page <= 1}
            className="p-2 rounded-lg border transition hover:bg-[var(--bg-muted)]"
            style={{ borderColor: "var(--border)", color: pagination.page <= 1 ? "var(--border)" : "var(--text-sub)" }}
          >
            <FiChevronLeft size={16} />
          </button>
          <span className="text-xs" style={{ color: "var(--text-mute)" }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => onPageChange?.(pagination.page + 1, search, roleFilter)}
            disabled={pagination.page >= pagination.pages}
            className="p-2 rounded-lg border transition hover:bg-[var(--bg-muted)]"
            style={{ borderColor: "var(--border)", color: pagination.page >= pagination.pages ? "var(--border)" : "var(--text-sub)" }}
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
