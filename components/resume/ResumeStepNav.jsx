"use client";
import { useResumeStore } from "../../store/useResumeStore";
import { FiUser, FiBriefcase, FiBook, FiCode, FiLink } from "react-icons/fi";

const STEPS = [
  { label: "Personal", icon: FiUser },
  { label: "Experience", icon: FiBriefcase },
  { label: "Education", icon: FiBook },
  { label: "Skills", icon: FiCode },
  { label: "Links", icon: FiLink },
];

export default function ResumeStepNav() {
  const { currentStep, setStep } = useResumeStore();

  return (
    <nav className="flex items-center gap-1 p-1.5 rounded-2xl mb-6"
      style={{ background: "var(--bg-muted)" }}>
      {STEPS.map((step, i) => {
        const active = i === currentStep;
        const completed = i < currentStep;
        const Icon = step.icon;

        return (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl
              text-xs sm:text-sm font-medium transition-all duration-200 relative"
            style={{
              background: active ? "var(--accent)" : "transparent",
              color: active ? "#fff" : completed ? "var(--accent)" : "var(--text-mute)",
            }}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{step.label}</span>

            {/* Completed dot indicator on mobile */}
            {completed && !active && (
              <span className="sm:hidden absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: "var(--accent)" }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
