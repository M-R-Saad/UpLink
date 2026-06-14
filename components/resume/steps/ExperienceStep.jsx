"use client";
import { useState } from "react";
import { useResumeStore } from "../../../store/useResumeStore";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { FiPlus, FiTrash2, FiBriefcase } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const emptyEntry = {
  title: "", company: "", location: "",
  startDate: "", endDate: "", isCurrent: false, description: "",
};

export default function ExperienceStep() {
  const { data, setData } = useResumeStore();
  const experience = data.experience || [];

  const update = (idx, field, value) => {
    const updated = experience.map((exp, i) =>
      i === idx ? { ...exp, [field]: value } : exp
    );
    setData("experience", updated);
  };

  const add = () => setData("experience", [...experience, { ...emptyEntry }]);

  const remove = (idx) => setData("experience", experience.filter((_, i) => i !== idx));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            Work Experience
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-mute)" }}>
            Add your most relevant work experience
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={add}>
          <FiPlus size={14} /> Add
        </Button>
      </div>

      {experience.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed"
          style={{ borderColor: "var(--border)", color: "var(--text-mute)" }}>
          <FiBriefcase size={32} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No experience added yet</p>
          <p className="text-xs mt-1">Click &quot;Add&quot; to start adding your work history</p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl border relative group"
            style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}
          >
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-4 right-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-100
                transition-all hover:bg-red-500/10 text-red-400 hover:text-red-500"
            >
              <FiTrash2 size={14} />
            </button>

            <div className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--accent)" }}>
              Position {i + 1}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Input label="Job Title" placeholder="Software Engineer"
                value={exp.title} onChange={(e) => update(i, "title", e.target.value)} />
              <Input label="Company" placeholder="Company name"
                value={exp.company} onChange={(e) => update(i, "company", e.target.value)} />
            </div>

            <Input label="Location" placeholder="Dhaka, Bangladesh"
              value={exp.location} onChange={(e) => update(i, "location", e.target.value)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <Input label="Start Date" placeholder="2022-01" type="month"
                value={exp.startDate} onChange={(e) => update(i, "startDate", e.target.value)} />
              <Input label="End Date" placeholder="2024-06" type="month"
                value={exp.endDate} onChange={(e) => update(i, "endDate", e.target.value)}
                disabled={exp.isCurrent} />
            </div>

            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input type="checkbox" checked={exp.isCurrent}
                onChange={(e) => {
                  update(i, "isCurrent", e.target.checked);
                  if (e.target.checked) update(i, "endDate", "");
                }}
                className="accent-[var(--accent)] w-4 h-4 rounded" />
              <span className="text-xs font-medium" style={{ color: "var(--text-sub)" }}>
                I currently work here
              </span>
            </label>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
                Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) => update(i, "description", e.target.value)}
                rows={3}
                placeholder="Describe your responsibilities and achievements..."
                className="w-full rounded-xl border px-3 py-2.5 text-sm transition resize-none
                  focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
                  bg-[var(--bg-card)] text-[var(--text)] placeholder:text-[var(--text-mute)]
                  border-[var(--border)]"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
