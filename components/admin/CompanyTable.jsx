"use client";
import { useState } from "react";
import { FiCheck, FiX, FiExternalLink } from "react-icons/fi";
import Badge from "../ui/Badge";
import { formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

export default function CompanyTable({ companies = [], onRefresh }) {
  const [tab, setTab] = useState("pending");
  const [updating, setUpdating] = useState(null);

  const pending  = companies.filter((c) => !c.isApproved);
  const approved = companies.filter((c) => c.isApproved);
  const list     = tab === "pending" ? pending : approved;

  const handleApproval = async (companyId, isApproved) => {
    setUpdating(companyId);
    try {
      const res = await fetch(`/api/admin/companies/${companyId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(isApproved ? "Company approved" : "Company rejected");
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
      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-4">
        <button
          onClick={() => setTab("pending")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition"
          style={{
            background: tab === "pending" ? "var(--accent)" : "var(--bg-muted)",
            color: tab === "pending" ? "#fff" : "var(--text-sub)",
          }}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab("approved")}
          className="px-4 py-2 rounded-lg text-sm font-medium transition"
          style={{
            background: tab === "approved" ? "var(--accent)" : "var(--bg-muted)",
            color: tab === "approved" ? "#fff" : "var(--text-sub)",
          }}
        >
          Approved ({approved.length})
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ background: "var(--bg-card)" }}>
            <thead>
              <tr style={{ background: "var(--bg-muted)" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Company</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Industry</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Registered</th>
                <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((company) => (
                <tr key={company._id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden"
                        style={{ background: "var(--bg-muted)", color: "var(--accent)" }}>
                        {company.logo ? (
                          <img src={company.logo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          company.name?.[0]
                        )}
                      </div>
                      <span className="font-medium truncate" style={{ color: "var(--text)" }}>{company.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-sub)" }}>{company.industry}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-sub)" }}>{company.location || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={company.isApproved ? "green" : "yellow"}>
                      {company.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-mute)" }}>
                    {formatDate(company.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/companies/${company._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg transition hover:bg-[var(--bg-muted)]"
                        style={{ color: "var(--text-sub)" }}
                        title="View profile"
                      >
                        <FiExternalLink size={14} />
                      </a>
                      {!company.isApproved ? (
                        <button
                          onClick={() => handleApproval(company._id, true)}
                          disabled={updating === company._id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-green-50"
                          style={{ color: "#10b981" }}
                        >
                          <FiCheck size={12} /> Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproval(company._id, false)}
                          disabled={updating === company._id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-red-50"
                          style={{ color: "#ef4444" }}
                        >
                          <FiX size={12} /> Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm" style={{ color: "var(--text-mute)" }}>
                    No {tab} companies
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
