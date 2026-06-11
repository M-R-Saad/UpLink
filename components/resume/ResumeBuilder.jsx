"use client";
import { useState, useCallback } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import ResumeStepNav from "./ResumeStepNav";
import ResumePreview from "./ResumePreview";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import ExperienceStep from "./steps/ExperienceStep";
import EducationStep from "./steps/EducationStep";
import SkillsStep from "./steps/SkillsStep";
import LinksStep from "./steps/LinksStep";
import Button from "../ui/Button";
import { FiChevronLeft, FiChevronRight, FiSave, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [PersonalInfoStep, ExperienceStep, EducationStep, SkillsStep, LinksStep];
const STEP_LABELS = ["Personal Info", "Experience", "Education", "Skills", "Links"];
const TOTAL = STEPS.length;

export default function ResumeBuilder({ onSave, saving }) {
  const { currentStep, setStep, data } = useResumeStore();
  const [showPreview, setShowPreview] = useState(false); // mobile preview toggle

  const StepComponent = STEPS[currentStep];

  const goNext = () => {
    if (currentStep < TOTAL - 1) setStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setStep(currentStep - 1);
  };

  const handleSave = useCallback(() => {
    if (onSave) onSave(data);
  }, [onSave, data]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left — Form */}
      <div className={`flex-1 min-w-0 ${showPreview ? "hidden lg:block" : ""}`}>
        <ResumeStepNav />

        {/* Step Content */}
        <div className="p-6 rounded-2xl border min-h-[400px]"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 gap-3">
          <Button
            variant="secondary"
            onClick={goBack}
            disabled={currentStep === 0}
          >
            <FiChevronLeft size={16} /> Back
          </Button>

          <div className="flex items-center gap-2">
            {/* Mobile preview toggle */}
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              {showPreview ? "Edit" : "Preview"}
            </Button>

            {/* Save */}
            <Button variant="outline" onClick={handleSave} loading={saving}>
              <FiSave size={14} /> Save
            </Button>

            {currentStep < TOTAL - 1 ? (
              <Button onClick={goNext}>
                Next <FiChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleSave} loading={saving}>
                <FiSave size={14} /> Save & Finish
              </Button>
            )}
          </div>
        </div>

        {/* Step indicator text */}
        <p className="text-center text-xs mt-3" style={{ color: "var(--text-mute)" }}>
          Step {currentStep + 1} of {TOTAL} — {STEP_LABELS[currentStep]}
        </p>
      </div>

      {/* Right — Live Preview */}
      <div className={`lg:w-[420px] xl:w-[460px] shrink-0 ${!showPreview ? "hidden lg:block" : ""}`}>
        <div className="sticky top-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-sub)" }}>
              Live Preview
            </h3>
            {/* Mobile close preview */}
            <button
              type="button"
              className="lg:hidden text-xs font-medium px-2 py-1 rounded-lg"
              style={{ color: "var(--accent)" }}
              onClick={() => setShowPreview(false)}
            >
              Back to Edit
            </button>
          </div>

          <div className="max-h-[calc(100vh-180px)] overflow-y-auto rounded-2xl"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
