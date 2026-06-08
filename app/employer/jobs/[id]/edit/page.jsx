"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import JobPostForm from "../../../../../components/employer/JobPostForm";
import Spinner from "../../../../../components/ui/Spinner";

export default function EditJobPage() {
  const router    = useRouter();
  const { id }    = useParams();
  const [job, setJob]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const d = json.data;
          setJob({
            title:        d.title,
            category:     d.category?._id,
            description:  d.description,
            requirements: d.requirements,
            skills:       d.skills,
            jobType:      d.jobType,
            locationType: d.locationType,
            location:     d.location,
            salary:       d.salary,
            experience:   d.experience,
            deadline:     d.deadline?.split("T")[0],
            vacancies:    d.vacancies,
            status:       d.status,
          });
        } else {
          toast.error("Job not found");
          router.push("/employer/jobs");
        }
      })
      .catch(() => {
        toast.error("Failed to load job");
        router.push("/employer/jobs");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res  = await fetch(`/api/jobs/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.message); return; }
      toast.success("Job updated successfully!");
      router.push("/employer/jobs");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Edit Job</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-sub)" }}>
          Update your job listing details
        </p>
      </div>
      <div className="p-6 rounded-2xl border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <JobPostForm onSubmit={onSubmit} defaultValues={job} loading={saving} />
      </div>
    </div>
  );
}
