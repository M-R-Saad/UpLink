"use client";
import { useState } from "react";
import { useApplications } from "../../../hooks/useApplications";
import ApplicationCard from "../../../components/dashboard/ApplicationCard";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import { FiFileText } from "react-icons/fi";
import Link from "next/link";
import Button from "../../../components/ui/Button";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "reviewed", label: "Reviewed" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { applications, statusCounts, isLoading } = useApplications(activeTab);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>My Applications</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
          Track and manage all your job applications
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 overflow-x-auto"
        style={{ background: "var(--bg-muted)" }}>
        {TABS.map(({ key, label }) => {
          const count = statusCounts[key] || 0;
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
              style={{
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#fff" : "var(--text-sub)",
              }}
            >
              {label}
              {count > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: active ? "rgba(255,255,255,0.2)" : "var(--border)",
                    color: active ? "#fff" : "var(--text-mute)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title={activeTab === "all" ? "No applications yet" : `No ${activeTab} applications`}
          description={activeTab === "all"
            ? "Start browsing jobs and apply to get started"
            : `You don't have any applications with "${activeTab}" status`}
          action={
            activeTab === "all" && (
              <Link href="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
