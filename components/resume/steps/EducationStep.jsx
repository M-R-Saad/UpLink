"use client";
import { useResumeStore } from "../../../store/useResumeStore";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { FiPlus, FiTrash2, FiBook } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const emptyEntry = {
  degree: "", institution: "", field: "",
  startYear: "", endYear: "", isOngoing: false,
};

export default function EducationStep() {
  const { data, setData } = useResumeStore();
  const education = data.education || [];

  const update = (idx, field, value) => {
    const updated = education.map((edu, i) =>
      i === idx ? { ...edu, [field]: value } : edu
    );
    setData("education", updated);
  };

  const add = () => setData("education", [...education, { ...emptyEntry }]);

  const remove = (idx) => setData("education", education.filter((_, i) => i !== idx));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            Education
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-mute)" }}>
            Add your educational background
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={add}>
          <FiPlus size={14} /> Add
        </Button>
      </div>

      {education.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed"
          style={{ borderColor: "var(--border)", color: "var(--text-mute)" }}>
          <FiBook size={32} className="mb-3 opacity-40" />
          <p className="text-sm font-medium">No education added yet</p>
          <p className="text-xs mt-1">Click &quot;Add&quot; to add your education history</p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {education.map((edu, i) => (
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
              Education {i + 1}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <Input label="Degree" placeholder="BSc / MSc / Diploma"
                value={edu.degree} onChange={(e) => update(i, "degree", e.target.value)} />
              <Input label="Field of Study" placeholder="Computer Science"
                value={edu.field} onChange={(e) => update(i, "field", e.target.value)} />
            </div>

            <Input label="Institution" placeholder="University / College name"
              value={edu.institution} onChange={(e) => update(i, "institution", e.target.value)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <Input label="Start Year" type="number" placeholder="2018"
                value={edu.startYear} onChange={(e) => update(i, "startYear", e.target.value)} />
              <Input label="End Year" type="number" placeholder="2022"
                value={edu.endYear} onChange={(e) => update(i, "endYear", e.target.value)}
                disabled={edu.isOngoing} />
            </div>

            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input type="checkbox" checked={edu.isOngoing}
                onChange={(e) => {
                  update(i, "isOngoing", e.target.checked);
                  if (e.target.checked) update(i, "endYear", "");
                }}
                className="accent-[var(--accent)] w-4 h-4 rounded" />
              <span className="text-xs font-medium" style={{ color: "var(--text-sub)" }}>
                Currently studying
              </span>
            </label>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
