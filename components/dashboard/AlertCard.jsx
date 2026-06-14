"use client";
import { useState } from "react";
import { FiBell, FiBellOff, FiEdit2, FiTrash2, FiClock, FiMapPin } from "react-icons/fi";
import { useToggleAlert, useDeleteAlert } from "../../hooks/useAlerts";
import Badge from "../ui/Badge";
import { timeAgo } from "../../lib/utils";

const JOB_TYPE_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

const LOCATION_LABELS = {
  any: "Any Location",
  remote: "Remote",
  onsite: "On-site",
  hybrid: "Hybrid",
};

const FREQUENCY_LABELS = {
  instant: "Instant",
  daily: "Daily Digest",
  weekly: "Weekly Digest",
};

export default function AlertCard({ alert, onEdit }) {
  const { mutate: toggle, isPending: toggling } = useToggleAlert();
  const { mutate: remove, isPending: deleting } = useDeleteAlert();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggle = () => {
    toggle({ id: alert._id, isActive: !alert.isActive });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    remove(alert._id);
  };

  return (
    <div
      className="p-5 rounded-2xl border transition-all"
      style={{
        background: "var(--bg-card)",
        borderColor: alert.isActive ? "var(--accent)" : "var(--border)",
        opacity: alert.isActive ? 1 : 0.65,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: alert.isActive ? "var(--accent-soft)" : "var(--bg-muted)",
              color: alert.isActive ? "var(--accent)" : "var(--text-mute)",
            }}
          >
            {alert.isActive ? <FiBell size={16} /> : <FiBellOff size={16} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
              {alert.label}
            </p>
            <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--text-mute)" }}>
              <FiClock size={10} />
              {FREQUENCY_LABELS[alert.frequency]}
              {alert.lastTriggeredAt && (
                <span> · Last triggered {timeAgo(alert.lastTriggeredAt)}</span>
              )}
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={toggling}
          className="relative w-10 h-5 rounded-full flex-shrink-0 transition-colors"
          style={{
            background: alert.isActive ? "var(--accent)" : "var(--border)",
          }}
          title={alert.isActive ? "Pause alert" : "Activate alert"}
        >
          <span
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
            style={{
              left: alert.isActive ? "calc(100% - 18px)" : "2px",
            }}
          />
        </button>
      </div>

      {/* Tags section */}
      <div className="space-y-2 mb-4">
        {/* Keywords */}
        {alert.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {alert.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* Categories */}
        {alert.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {alert.categories.map((cat) => (
              <span
                key={cat._id || cat}
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: "var(--bg-muted)", color: "var(--text-sub)" }}
              >
                {cat.icon} {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Job types & location */}
        <div className="flex flex-wrap items-center gap-1.5">
          {alert.jobTypes?.length > 0 &&
            alert.jobTypes.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: "var(--bg-muted)", color: "var(--text-mute)" }}
              >
                {JOB_TYPE_LABELS[t] || t}
              </span>
            ))}
          {alert.locationType && alert.locationType !== "any" && (
            <span
              className="text-xs px-2 py-0.5 rounded-md flex items-center gap-1"
              style={{ background: "var(--bg-muted)", color: "var(--text-mute)" }}
            >
              <FiMapPin size={10} />
              {LOCATION_LABELS[alert.locationType]}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          type="button"
          onClick={() => onEdit(alert)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-[var(--bg-muted)]"
          style={{ color: "var(--accent)" }}
        >
          <FiEdit2 size={12} /> Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-red-50"
          style={{ color: confirmDelete ? "#ef4444" : "var(--text-mute)" }}
        >
          <FiTrash2 size={12} /> {confirmDelete ? "Confirm?" : "Delete"}
        </button>
      </div>
    </div>
  );
}
