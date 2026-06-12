"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSaveJob, useIsSaved } from "../../hooks/useSavedJobs";
import { FiBookmark } from "react-icons/fi";
import { cn } from "../../lib/utils";

export default function SaveJobButton({ jobId, size = "md", className }) {
  const { data: session } = useSession();
  const router = useRouter();
  const isSaved = useIsSaved(jobId);
  const { saveJob, unsaveJob, isSaving } = useSaveJob();

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) { router.push("/login"); return; }
    if (session.user.role !== "jobseeker") return;

    if (isSaved) {
      unsaveJob(jobId);
    } else {
      saveJob(jobId);
    }
  };

  if (session?.user?.role === "employer") return null;

  const sizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10",
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isSaving}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border transition-all duration-200",
        "hover:border-[var(--accent)] disabled:opacity-50",
        sizes[size],
        className
      )}
      style={{
        borderColor: isSaved ? "var(--accent)" : "var(--border)",
        background: isSaved ? "var(--accent-soft)" : "transparent",
        color: isSaved ? "var(--accent)" : "var(--text-mute)",
      }}
      title={isSaved ? "Remove from saved" : "Save job"}
    >
      <FiBookmark
        size={size === "sm" ? 14 : 16}
        fill={isSaved ? "currentColor" : "none"}
      />
    </button>
  );
}
