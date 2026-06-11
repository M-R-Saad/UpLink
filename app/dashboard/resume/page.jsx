"use client";
import { useEffect, useState, useCallback } from "react";
import { useResumeStore } from "../../../store/useResumeStore";
import ResumeBuilder from "../../../components/resume/ResumeBuilder";
import Spinner from "../../../components/ui/Spinner";
import Button from "../../../components/ui/Button";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically import pdf() to avoid SSR issues with react-pdf
const PDFDownload = dynamic(
  () => import("../../../components/resume/ResumePDFDownload"),
  { ssr: false }
);

export default function ResumePage() {
  const { data, loadData } = useResumeStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing resume data on mount
  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch("/api/resume");
        const json = await res.json();
        if (json.success && json.data?.resumeData) {
          loadData(json.data.resumeData);
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, [loadData]);

  // Save resume data to API
  const handleSave = useCallback(async (resumeData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Resume saved successfully!");
      } else {
        toast.error(json.message || "Failed to save resume");
      }
    } catch (err) {
      toast.error("Failed to save resume");
    } finally {
      setSaving(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Resume Builder
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
            Build your professional resume step by step
          </p>
        </div>
        <PDFDownload data={data} />
      </div>

      {/* Builder */}
      <ResumeBuilder onSave={handleSave} saving={saving} />
    </div>
  );
}
