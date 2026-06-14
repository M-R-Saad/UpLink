"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FiStar, FiThumbsUp, FiThumbsDown, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useReviews, useCreateReview } from "../../hooks/useReviews";
import Badge from "../ui/Badge";
import { timeAgo } from "../../lib/utils";

const EMPLOYMENT_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  intern: "Intern",
};

function StarRating({ value, onChange, size = 20, interactive = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className="transition-transform"
          style={{
            cursor: interactive ? "pointer" : "default",
            color: star <= (hover || value) ? "#f59e0b" : "var(--border)",
            transform: interactive && star <= hover ? "scale(1.15)" : "scale(1)",
          }}
        >
          <FiStar size={size} fill={star <= (hover || value) ? "#f59e0b" : "none"} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div
      className="p-5 rounded-2xl border transition-all"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: "var(--bg-muted)", color: "var(--text-mute)" }}
          >
            {review.user?.image ? (
              <img src={review.user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <FiUser size={16} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              {review.user?.name || "Anonymous"}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRating value={review.rating} size={12} />
              <span className="text-xs" style={{ color: "var(--text-mute)" }}>
                {timeAgo(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {review.isCurrentEmployee && (
            <Badge variant="green">Current Employee</Badge>
          )}
          <Badge variant="default">{EMPLOYMENT_LABELS[review.employmentType] || review.employmentType}</Badge>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
          {review.title}
        </h4>
      )}

      {/* Comment */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-sub)" }}>
        {review.comment}
      </p>

      {/* Pros & Cons */}
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {review.pros && (
            <div className="flex gap-2 text-xs">
              <FiThumbsUp
                size={13}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#22c55e" }}
              />
              <div>
                <p className="font-semibold mb-0.5" style={{ color: "#22c55e" }}>Pros</p>
                <p style={{ color: "var(--text-sub)" }}>{review.pros}</p>
              </div>
            </div>
          )}
          {review.cons && (
            <div className="flex gap-2 text-xs">
              <FiThumbsDown
                size={13}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#ef4444" }}
              />
              <div>
                <p className="font-semibold mb-0.5" style={{ color: "#ef4444" }}>Cons</p>
                <p style={{ color: "var(--text-sub)" }}>{review.cons}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ReviewForm({ companyId, onSuccess }) {
  const { mutate, isPending } = useCreateReview(companyId);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [employmentType, setEmploymentType] = useState("full-time");
  const [isCurrentEmployee, setIsCurrentEmployee] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    mutate(
      { rating, title, comment, pros, cons, employmentType, isCurrentEmployee, isAnonymous },
      {
        onSuccess: (json) => {
          if (json.success) {
            setRating(0);
            setTitle("");
            setComment("");
            setPros("");
            setCons("");
            setIsCurrentEmployee(false);
            setIsAnonymous(false);
            onSuccess?.();
          }
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl border"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <h3 className="text-base font-semibold mb-4" style={{ color: "var(--text)" }}>
        Write a Review
      </h3>

      {/* Star rating */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-sub)" }}>
          Overall Rating *
        </label>
        <div className="flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} size={24} interactive />
          {rating > 0 && (
            <span className="text-sm font-medium" style={{ color: "#f59e0b" }}>
              {rating}/5
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-sub)" }}>
          Review Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors"
          style={{
            background: "var(--bg-muted)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-sub)" }}>
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience working at this company..."
          rows={4}
          maxLength={2000}
          required
          className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors resize-none"
          style={{
            background: "var(--bg-muted)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
          {comment.length}/2000
        </p>
      </div>

      {/* Pros & Cons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: "#22c55e" }}>
            <FiThumbsUp size={11} /> Pros
          </label>
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="What did you like?"
            rows={3}
            maxLength={500}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors resize-none"
            style={{
              background: "var(--bg-muted)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1.5 flex items-center gap-1" style={{ color: "#ef4444" }}>
            <FiThumbsDown size={11} /> Cons
          </label>
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="What could be improved?"
            rows={3}
            maxLength={500}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none transition-colors resize-none"
            style={{
              background: "var(--bg-muted)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>

      {/* Employment details & options */}
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <div>
          <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-sub)" }}>
            Employment Type
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm border outline-none"
            style={{
              background: "var(--bg-muted)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-5">
          <input
            type="checkbox"
            checked={isCurrentEmployee}
            onChange={(e) => setIsCurrentEmployee(e.target.checked)}
            className="rounded"
            style={{ accentColor: "var(--accent)" }}
          />
          <span className="text-xs" style={{ color: "var(--text-sub)" }}>
            I currently work here
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer mt-5">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="rounded"
            style={{ accentColor: "var(--accent)" }}
          />
          <span className="text-xs" style={{ color: "var(--text-sub)" }}>
            Post anonymously
          </span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || rating === 0 || comment.length < 10}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{
          background: rating > 0 && comment.length >= 10 ? "var(--accent)" : "var(--border)",
          color: rating > 0 && comment.length >= 10 ? "#fff" : "var(--text-mute)",
          opacity: isPending ? 0.6 : 1,
          cursor: isPending || rating === 0 || comment.length < 10 ? "not-allowed" : "pointer",
        }}
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export default function CompanyReviews({ companyId }) {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReviews(companyId, page);

  const reviews    = data?.reviews || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };
  const isSeeker   = session?.user?.role === "jobseeker";

  // Check if current user already reviewed
  const hasReviewed = reviews.some(
    (r) => r.user?._id === session?.user?.id || r.user?.name === session?.user?.name
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          Reviews
          {pagination.total > 0 && (
            <span className="text-sm font-normal ml-2" style={{ color: "var(--text-mute)" }}>
              ({pagination.total})
            </span>
          )}
        </h2>
      </div>

      {/* Review form — seekers only, if not already reviewed */}
      {isSeeker && !hasReviewed && (
        <div className="mb-6">
          <ReviewForm companyId={companyId} />
        </div>
      )}

      {isSeeker && hasReviewed && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-sm"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          ✓ You have already submitted a review for this company.
        </div>
      )}

      {/* Reviews list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl animate-pulse"
              style={{ background: "var(--bg-muted)" }}
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div
          className="text-center py-12 rounded-2xl border"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
        >
          <FiStar size={36} className="mx-auto mb-3 opacity-20" style={{ color: "var(--text-sub)" }} />
          <p className="font-medium text-sm" style={{ color: "var(--text)" }}>
            No reviews yet
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
            {isSeeker ? "Be the first to share your experience!" : "Reviews from job seekers will appear here."}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border transition hover:bg-[var(--bg-muted)]"
                style={{
                  borderColor: "var(--border)",
                  color: page <= 1 ? "var(--border)" : "var(--text-sub)",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                }}
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-xs" style={{ color: "var(--text-mute)" }}>
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="p-2 rounded-lg border transition hover:bg-[var(--bg-muted)]"
                style={{
                  borderColor: "var(--border)",
                  color: page >= pagination.pages ? "var(--border)" : "var(--text-sub)",
                  cursor: page >= pagination.pages ? "not-allowed" : "pointer",
                }}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
