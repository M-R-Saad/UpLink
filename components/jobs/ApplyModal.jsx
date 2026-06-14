"use client";
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useApply } from "../../hooks/useApplications";
import { FiFileText, FiUpload, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { useUpload } from "../../hooks/useUpload";

export default function ApplyModal({ open, onClose, jobId, jobTitle }) {
  const { mutateAsync: apply, isPending } = useApply();
  const { upload, uploading } = useUpload();
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeURL, setResumeURL] = useState(null);
  const [profileResume, setProfileResume] = useState(null);
  const [resumeSource, setResumeSource] = useState("profile"); // "profile" | "upload"
  const [success, setSuccess] = useState(false);

  // Fetch profile resume URL on open
  useEffect(() => {
    if (open) {
      const handle = requestAnimationFrame(() => {
        setSuccess(false);
        setCoverLetter("");
        setResumeSource("profile");
      });
      fetch("/api/profile")
        .then((r) => r.json())
        .then((j) => {
          if (j.success && j.data?.resumeURL && j.data.resumeURL !== "null") {
            setProfileResume(j.data.resumeURL);
            setResumeURL(j.data.resumeURL);
          } else {
            setProfileResume(null);
            setResumeURL(null);
          }
        })
        .catch(() => {});
      return () => cancelAnimationFrame(handle);
    }
  }, [open]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    const url = await upload(file, "resumes");
    if (url) {
      setResumeURL(url);
      setResumeSource("upload");
    }
  };

  const handleSubmit = async () => {
    const url = resumeSource === "profile" ? profileResume : resumeURL;
    if (!url) {
      toast.error("Please select or upload a resume");
      return;
    }

    const result = await apply({ jobId, resumeURL: url, coverLetter });
    if (result?.success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <Modal open={open} onClose={onClose} title="Application Submitted" size="md">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "var(--accent-soft)" }}>
            <FiCheckCircle size={32} style={{ color: "var(--accent)" }} />
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
            Applied Successfully!
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>
            Your application for <strong>{jobTitle}</strong> has been submitted.
            You can track its status in your dashboard.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={`Apply for ${jobTitle || "Job"}`} size="lg">
      <div className="space-y-5">
        {/* Resume Selection */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>
            Resume
          </label>
          <div className="space-y-2">
            {/* Built resume option */}
            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                resumeSource === "profile" ? "ring-2 ring-[var(--accent)]" : ""
              }`}
              style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}
            >
              <input
                type="radio"
                name="resume"
                checked={resumeSource === "profile"}
                onChange={() => { setResumeSource("profile"); setResumeURL(profileResume); }}
                className="accent-[var(--accent)]"
              />
              <FiFileText size={18} style={{ color: "var(--accent)" }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Use my built resume
                </p>
                <p className="text-xs" style={{ color: "var(--text-mute)" }}>
                  {profileResume ? "Resume available from your profile" : "No resume built yet — build one in Resume Builder"}
                </p>
              </div>
              {profileResume && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                  Ready
                </span>
              )}
            </label>

            {/* Upload option */}
            <label
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                resumeSource === "upload" ? "ring-2 ring-[var(--accent)]" : ""
              }`}
              style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}
            >
              <input
                type="radio"
                name="resume"
                checked={resumeSource === "upload"}
                onChange={() => setResumeSource("upload")}
                className="accent-[var(--accent)]"
              />
              <FiUpload size={18} style={{ color: "var(--accent)" }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Upload a different resume
                </p>
                <p className="text-xs" style={{ color: "var(--text-mute)" }}>
                  {resumeSource === "upload" && resumeURL && resumeURL !== profileResume
                    ? "PDF uploaded ✓"
                    : "Upload a PDF file"}
                </p>
              </div>
            </label>

            {resumeSource === "upload" && (
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="block w-full text-sm file:mr-3 file:py-2 file:px-4
                  file:rounded-xl file:border-0 file:text-sm file:font-semibold
                  file:bg-[var(--accent-soft)] file:text-[var(--accent)]
                  hover:file:opacity-80 cursor-pointer mt-2"
                style={{ color: "var(--text-sub)" }}
              />
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
            Cover Letter <span className="font-normal" style={{ color: "var(--text-mute)" }}>(optional)</span>
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            placeholder="Tell the employer why you're a great fit for this role..."
            className="w-full rounded-xl border px-3 py-2.5 text-sm transition resize-none
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
              bg-[var(--bg-card)] text-[var(--text)] placeholder:text-[var(--text-mute)]
              border-[var(--border)]"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isPending || uploading}
            disabled={!resumeURL && resumeSource === "profile" && !profileResume}
            className="flex-1"
          >
            Submit Application
          </Button>
        </div>
      </div>
    </Modal>
  );
}
