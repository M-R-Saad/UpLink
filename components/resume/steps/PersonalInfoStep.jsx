"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useResumeStore } from "../../../store/useResumeStore";
import Input from "../../ui/Input";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function PersonalInfoStep() {
  const { data, setData } = useResumeStore();
  const info = data.personalInfo;

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: info,
  });

  // Sync store → form when store loads from API
  useEffect(() => {
    reset(info);
  }, [info.name, info.email]); // re-sync on initial hydration

  // Live sync: form → store on every change
  useEffect(() => {
    const sub = watch((values) => {
      setData("personalInfo", values);
    });
    return () => sub.unsubscribe();
  }, [watch, setData]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
          Personal Information
        </h3>
        <p className="text-sm" style={{ color: "var(--text-mute)" }}>
          This info will appear at the top of your resume
        </p>
      </div>

      <div className="space-y-4">
        <Input label="Full Name" placeholder="e.g. Rafiq Ahmed" icon={FiUser} {...register("name")} />
        <Input label="Professional Headline" placeholder="e.g. Full Stack Developer" {...register("headline")} />

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
            Professional Summary
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            placeholder="Briefly describe your experience, skills, and career goals..."
            className="w-full rounded-xl border px-3 py-2.5 text-sm transition resize-none
              focus:outline-none focus:ring-2 focus:ring-[var(--accent)]
              bg-[var(--bg-card)] text-[var(--text)] placeholder:text-[var(--text-mute)]
              border-[var(--border)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email" type="email" placeholder="you@example.com" icon={FiMail} {...register("email")} />
          <Input label="Phone" placeholder="01XXXXXXXXX" icon={FiPhone} {...register("phone")} />
        </div>

        <Input label="Location" placeholder="Dhaka, Bangladesh" icon={FiMapPin} {...register("location")} />
      </div>
    </div>
  );
}
