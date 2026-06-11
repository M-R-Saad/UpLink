"use client";
import { useState } from "react";
import { useResumeStore } from "../../../store/useResumeStore";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTED = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python",
  "MongoDB", "PostgreSQL", "Docker", "AWS", "Git", "Tailwind CSS",
  "GraphQL", "REST API", "HTML/CSS", "Figma",
];

export default function SkillsStep() {
  const { data, setData } = useResumeStore();
  const skills = data.skills || [];
  const [input, setInput] = useState("");

  const addSkill = (skill) => {
    const val = (skill || input).trim();
    if (!val || skills.includes(val)) return;
    setData("skills", [...skills, val]);
    setInput("");
  };

  const removeSkill = (skill) => {
    setData("skills", skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestions = SUGGESTED.filter((s) => !skills.includes(s));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          Skills
        </h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-mute)" }}>
          Add your technical and professional skills
        </p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter..."
          className="flex-1 rounded-xl border px-3 py-2.5 text-sm transition
            focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
            bg-[var(--bg-card)] text-[var(--text)] placeholder:text-[var(--text-mute)]
            border-[var(--border)]"
        />
        <button
          type="button"
          onClick={() => addSkill()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          Add
        </button>
      </div>

      {/* Skills chips */}
      <div className="min-h-[48px]">
        <AnimatePresence mode="popLayout">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full
                  font-medium cursor-default group"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="p-0.5 rounded-full transition hover:bg-[var(--accent)] hover:text-white"
                >
                  <FiX size={12} />
                </button>
              </motion.span>
            ))}
          </div>
        </AnimatePresence>

        {skills.length === 0 && (
          <p className="text-sm py-2" style={{ color: "var(--text-mute)" }}>
            No skills added yet — start typing above or pick from suggestions below
          </p>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2 uppercase tracking-wider"
            style={{ color: "var(--text-mute)" }}>
            Popular Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition
                  hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{ borderColor: "var(--border)", color: "var(--text-sub)", background: "transparent" }}
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <p className="text-xs" style={{ color: "var(--text-mute)" }}>
          {skills.length} skill{skills.length !== 1 ? "s" : ""} added
        </p>
      )}
    </div>
  );
}
