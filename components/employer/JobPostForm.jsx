"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { createJobSchema } from "../../schemas/jobSchemas";
import Button from "../ui/Button";
import Input from "../ui/Input";

const JOB_TYPES      = ["full-time","part-time","contract","internship","freelance"];
const LOCATION_TYPES = ["onsite","remote","hybrid"];
const EXPERIENCE     = ["any","entry","mid","senior","lead"];
const CURRENCIES     = ["BDT","USD","EUR"];
const PERIODS        = ["monthly","yearly","hourly"];

const sel = "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";
const selStyle = { borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text)" };

const Section = ({ title, children }) => (
  <div className="p-5 rounded-2xl border space-y-4"
    style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{title}</p>
    {children}
  </div>
);

const DynamicList = ({ fields, onAdd, onRemove, placeholder, label, register }) => (
  <div>
    <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>{label}</p>
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div key={field.id} className="flex gap-2">
          <input
            {...register(`${placeholder === "requirement" ? "requirements" : "responsibilities"}.${i}`)}
            placeholder={`Add ${placeholder}...`}
            className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={selStyle}
          />
          <button type="button" onClick={() => onRemove(i)}
            className="p-2 rounded-xl hover:bg-red-50 text-red-400 transition">
            <FiX size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onAdd("")}
        className="flex items-center gap-1.5 text-sm font-medium transition hover:opacity-70"
        style={{ color: "var(--accent)" }}>
        <FiPlus size={14} /> Add {placeholder}
      </button>
    </div>
  </div>
);

export default function JobPostForm({ onSubmit, defaultValues, loading }) {
  const [categories, setCategories] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((j) => setCategories(j.data || []));
  }, []);

  const { register, handleSubmit, control, watch, setValue, getValues,
    formState: { errors } } = useForm({
    resolver: zodResolver(createJobSchema),
    defaultValues: defaultValues || {
      status: "active", experience: "any",
      vacancies: 1, skills: [],
      requirements: [], responsibilities: [],
      salary: { currency: "BDT", period: "monthly", isNegotiable: false, isUndisclosed: false },
    },
  });

  const { fields: reqFields,  append: addReq,  remove: removeReq  } = useFieldArray({ control, name: "requirements" });
  const { fields: respFields, append: addResp, remove: removeResp } = useFieldArray({ control, name: "responsibilities" });

  const skills = watch("skills") || [];

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    const current = getValues("skills") || [];
    if (!current.includes(val)) setValue("skills", [...current, val]);
    setSkillInput("");
  };

  const removeSkill = (s) => {
    setValue("skills", (getValues("skills") || []).filter((x) => x !== s));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Basic Info */}
      <Section title="Basic Information">
        <Input label="Job Title" placeholder="e.g. Senior React Developer"
          error={errors.title?.message} {...register("title")} />

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Category</label>
          <select {...register("category")} className={sel} style={selStyle}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Job Type</label>
            <select {...register("jobType")} className={sel} style={selStyle}>
              <option value="">Select type</option>
              {JOB_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
            {errors.jobType && <p className="text-xs text-red-500 mt-1">{errors.jobType.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Work Mode</label>
            <select {...register("locationType")} className={sel} style={selStyle}>
              <option value="">Select mode</option>
              {LOCATION_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
            </select>
            {errors.locationType && <p className="text-xs text-red-500 mt-1">{errors.locationType.message}</p>}
          </div>
        </div>

        <Input label="Location" placeholder="e.g. Dhaka, Bangladesh (leave blank if remote)"
          {...register("location")} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Experience Level</label>
            <select {...register("experience")} className={sel} style={selStyle}>
              {EXPERIENCE.map((e) => <option key={e} value={e} className="capitalize">{e === "any" ? "Any level" : e}</option>)}
            </select>
          </div>
          <Input label="Vacancies" type="number"
            {...register("vacancies", { valueAsNumber: true })} />
        </div>

        <Input label="Application Deadline" type="date"
          error={errors.deadline?.message} {...register("deadline")} />
      </Section>

      {/* Description */}
      <Section title="Job Description">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register("description")}
            rows={8}
            placeholder="Describe the role, what the team does, why someone should join..."
            className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
            style={selStyle}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <DynamicList
          fields={respFields} onAdd={addResp} onRemove={removeResp}
          placeholder="responsibility" label="Responsibilities" register={register}
        />
        <DynamicList
          fields={reqFields} onAdd={addReq} onRemove={removeReq}
          placeholder="requirement" label="Requirements" register={register}
        />
      </Section>

      {/* Skills */}
      <Section title="Required Skills">
        <div>
          <div className="flex gap-2 mb-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              placeholder="Type a skill and press Enter..."
              className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={selStyle}
            />
            <button type="button" onClick={addSkill}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--accent)" }}>
              Add
            </button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {skills.map((s) => (
                <span key={s}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                  {s}
                  <button type="button" onClick={() => removeSkill(s)}>
                    <FiX size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Salary */}
      <Section title="Salary (optional)">
        <div className="grid grid-cols-3 gap-3">
          <Input label="Min" type="number" placeholder="50000"
            {...register("salary.min", { valueAsNumber: true })} />
          <Input label="Max" type="number" placeholder="100000"
            {...register("salary.max", { valueAsNumber: true })} />
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Currency</label>
            <select {...register("salary.currency")} className={sel} style={selStyle}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Period</label>
          <select {...register("salary.period")} className={sel} style={selStyle}>
            {PERIODS.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
          </select>
        </div>
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-sub)" }}>
            <input type="checkbox" {...register("salary.isNegotiable")} className="accent-[var(--accent)]" />
            Negotiable
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--text-sub)" }}>
            <input type="checkbox" {...register("salary.isUndisclosed")} className="accent-[var(--accent)]" />
            Hide salary (show "Competitive")
          </label>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" loading={loading} fullWidth>
          {defaultValues ? "Update Job" : "Post Job"}
        </Button>
        <button type="button"
          onClick={() => { setValue("status", "draft"); handleSubmit(onSubmit)(); }}
          className="px-5 py-2 rounded-xl border text-sm font-semibold transition hover:opacity-80 flex-shrink-0"
          style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}>
          Save Draft
        </button>
      </div>
    </form>
  );
}
