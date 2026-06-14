"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useResumeStore } from "../../../store/useResumeStore";
import Input from "../../ui/Input";
import { FiGithub, FiLinkedin, FiGlobe, FiLink } from "react-icons/fi";

export default function LinksStep() {
  const { data, setData } = useResumeStore();
  const links = data.links;

  const { register, watch, reset } = useForm({
    defaultValues: links,
  });

  // Sync store → form on hydration
  useEffect(() => {
    reset(links);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links.github, links.linkedin]); // re-sync on initial load

  // Live sync: form → store
  useEffect(() => {
    const sub = watch((values) => {
      setData("links", values);
    });
    return () => sub.unsubscribe();
  }, [watch, setData]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          Links & Portfolio
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-mute)" }}>
          Add your online profiles and portfolio links
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
              <FiGithub size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>GitHub</p>
              <p className="text-xs" style={{ color: "var(--text-mute)" }}>Your GitHub profile</p>
            </div>
          </div>
          <Input placeholder="https://github.com/username" {...register("github")} />
        </div>

        <div className="p-5 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#dbeafe", color: "#2563eb" }}>
              <FiLinkedin size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>LinkedIn</p>
              <p className="text-xs" style={{ color: "var(--text-mute)" }}>Your LinkedIn profile</p>
            </div>
          </div>
          <Input placeholder="https://linkedin.com/in/username" {...register("linkedin")} />
        </div>

        <div className="p-5 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#dcfce7", color: "#16a34a" }}>
              <FiGlobe size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Portfolio</p>
              <p className="text-xs" style={{ color: "var(--text-mute)" }}>Your personal website</p>
            </div>
          </div>
          <Input placeholder="https://yourportfolio.com" {...register("portfolio")} />
        </div>

        <div className="p-5 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#fef3c7", color: "#d97706" }}>
              <FiLink size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>Other</p>
              <p className="text-xs" style={{ color: "var(--text-mute)" }}>Any other relevant link</p>
            </div>
          </div>
          <Input placeholder="https://example.com" {...register("other")} />
        </div>
      </div>
    </div>
  );
}
