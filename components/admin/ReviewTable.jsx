"use client";
import { useState } from "react";
import { FiStar, FiTrash2 } from "react-icons/fi";
import Badge from "../ui/Badge";
import { formatDate, timeAgo } from "../../lib/utils";
import toast from "react-hot-toast";

export default function ReviewTable({ reviews = [], onRefresh }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (reviewId) => {
    if (!confirm("Delete this review?")) return;
    setDeleting(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Review deleted");
        onRefresh?.();
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ background: "var(--bg-card)" }}>
          <thead>
            <tr style={{ background: "var(--bg-muted)" }}>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Reviewer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Rating</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Comment</th>
              <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Date</th>
              <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color: "var(--text-mute)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text)" }}>
                  {review.isAnonymous ? (
                    <span style={{ color: "var(--text-mute)" }}>Anonymous</span>
                  ) : (
                    review.user?.name || "Unknown"
                  )}
                </td>
                <td className="px-4 py-3 text-xs font-medium truncate" style={{ color: "var(--text-sub)" }}>
                  {review.company?.name || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar
                        key={s}
                        size={11}
                        fill={s <= review.rating ? "#f59e0b" : "none"}
                        style={{ color: s <= review.rating ? "#f59e0b" : "var(--border)" }}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs truncate max-w-[250px]" style={{ color: "var(--text-sub)" }}>
                    {review.title ? <strong>{review.title}: </strong> : null}
                    {review.comment}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text-mute)" }}>
                  {timeAgo(review.createdAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={deleting === review._id}
                    className="p-1.5 rounded-lg transition hover:bg-red-50"
                    style={{ color: "#ef4444" }}
                    title="Delete review"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-sm" style={{ color: "var(--text-mute)" }}>
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
