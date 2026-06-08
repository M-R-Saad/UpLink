"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import JobPostForm from "../../../../components/employer/JobPostForm";

export default function NewJobPage() {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res  = await fetch("/api/jobs", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.message); return; }
      toast.success(
        data.status === "draft" ? "Job saved as draft" : "Job posted successfully!"
      );
      router.push("/employer/jobs");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Post a New Job</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-sub)" }}>
          Fill in the details below to attract the right candidates
        </p>
      </div>
      <div className="p-6 rounded-2xl border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <JobPostForm onSubmit={onSubmit} loading={loading} />
      </div>
    </div>
  );
}
