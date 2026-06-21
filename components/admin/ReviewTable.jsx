"use client";
import { useState } from "react";
import { FiStar, FiTrash2, FiEye, FiX } from "react-icons/fi";
import Badge from "../ui/Badge";
import { formatDate, timeAgo } from "../../lib/utils";
import toast from "react-hot-toast";

function ReviewDetailModal({ review, open, onClose }) {
  if (!open || !review) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border p-6"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--bg-muted)] transition"
          style={{ color: "var(--text-mute)" }}>
          <FiX size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            <FiStar size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>Review Details</h3>
            <p className="text-xs" style={{ color: "var(--text-mute)" }}>{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar key={s} size={16} fill={s <= review.rating ? "#f59e0b" : "none"}
                style={{ color: s <= review.rating ? "#f59e0b" : "var(--border)" }} />
            ))}
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{review.rating}/5</span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl" style={{ background: "var(--bg-muted)" }}>
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-mute)" }}>Reviewer</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {review.isAnonymous ? "Anonymous" : (review.user?.name || "Unknown")}
            </p>
            {!review.isAnonymous && review.user?.email && (
              <p className="text-xs" style={{ color: "var(--text-mute)" }}>{review.user.email}</p>
            )}
          </div>
          <div className="p-3 rounded-xl" style={{ background: "var(--bg-muted)" }}>
            <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-mute)" }}>Company</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{review.company?.name || "—"}</p>
          </div>
        </div>

        {/* Title & Comment */}
        {review.title && (
          <div className="mb-3">
            <p className="text-xs font-medium mb-1" style={{ color: "var(--text-mute)" }}>Title</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{review.title}</p>
          </div>
        )}
        <div className="mb-4">
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-mute)" }}>Comment</p>
          <p className="text-sm leading-relaxed p-3 rounded-xl" 
            style={{ color: "var(--text-sub)", background: "var(--bg-muted)" }}>
            {review.comment || "No comment provided"}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant={review.isApproved ? "green" : "yellow"}>
            {review.isApproved ? "Approved" : "Pending"}
          </Badge>
          {review.isAnonymous && <Badge variant="default">Anonymous</Badge>}
        </div>
      </div>
    </div>
  );
}

export default function ReviewTable({ reviews = [], onRefresh }) {
  const [deleting, setDeleting] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

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
    <>
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
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="p-1.5 rounded-lg transition hover:bg-[var(--accent-soft)]"
                        style={{ color: "var(--accent)" }}
                        title="View details"
                      >
                        <FiEye size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={deleting === review._id}
                        className="p-1.5 rounded-lg transition hover:bg-red-50"
                        style={{ color: "#ef4444" }}
                        title="Delete review"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
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

      <ReviewDetailModal
        review={selectedReview}
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </>
  );
}
