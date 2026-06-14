"use client";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useProfile } from "../../../hooks/useProfile";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Spinner from "../../../components/ui/Spinner";

const is = { borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text)" };
const ic = "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";

const Section = ({ title, children, action }) => (
  <div className="p-6 rounded-2xl border mb-5" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold" style={{ color: "var(--text)" }}>{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, updating } = useProfile();
  const [skillInput, setSkillInput] = useState("");

  const { register, handleSubmit, reset, control, watch, setValue, getValues } = useForm();
  const { fields: expFields, append: addExp, remove: removeExp } = useFieldArray({ control, name: "experience" });
  const { fields: eduFields, append: addEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const skills = watch("skills") || [];

  useEffect(() => {
    if (profile) {
      reset({
        headline:   profile.headline   || "",
        bio:        profile.bio        || "",
        phone:      profile.phone      || "",
        location:   profile.location   || "",
        skills:     profile.skills     || [],
        experience: profile.experience || [],
        education:  profile.education  || [],
        isOpenToWork: profile.isOpenToWork ?? true,
        links: {
          github:    profile.links?.github    || "",
          linkedin:  profile.links?.linkedin  || "",
          portfolio: profile.links?.portfolio || "",
          other:     profile.links?.other     || "",
        },
      });
    }
  }, [profile, reset]);

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    const current = getValues("skills") || [];
    if (!current.includes(val)) setValue("skills", [...current, val]);
    setSkillInput("");
  };

  const removeSkill = (s) => setValue("skills", (getValues("skills") || []).filter((x) => x !== s));


  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>My Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>Keep your profile updated for better job matches</p>
      </div>

      <form onSubmit={handleSubmit(updateProfile)}>
        <Section title="Personal Information">
          <div className="space-y-4">
            <Input label="Professional Headline" placeholder="e.g. Full Stack Developer" {...register("headline")} />
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Bio</label>
              <textarea {...register("bio")} rows={4} placeholder="Tell employers about yourself..."
                className={`${ic} resize-none`} style={is} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" placeholder="01XXXXXXXXX" {...register("phone")} />
              <Input label="Location" placeholder="Dhaka, Bangladesh" {...register("location")} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isOpenToWork")} className="accent-[var(--accent)] w-4 h-4" />
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>Open to work</span>
            </label>
          </div>
        </Section>

        <Section title="Skills">
          <div className="flex gap-2 mb-3">
            <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              placeholder="Type a skill and press Enter..." className={ic} style={is} />
            <button type="button" onClick={addSkill}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
              style={{ background: "var(--accent)" }}>Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                {s}
                <button type="button" onClick={() => removeSkill(s)}>✕</button>
              </span>
            ))}
          </div>
        </Section>

        <Section title="Work Experience"
          action={
            <button type="button"
              onClick={() => addExp({ title:"", company:"", location:"", startDate:"", endDate:"", isCurrent:false, description:"" })}
              className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--accent)" }}>
              <FiPlus size={13} /> Add
            </button>
          }>
          {expFields.length === 0
            ? <p className="text-sm" style={{ color: "var(--text-mute)" }}>No experience added yet</p>
            : <div className="space-y-4">
                {expFields.map((field, i) => (
                  <div key={field.id} className="p-4 rounded-xl border relative"
                    style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                    <button type="button" onClick={() => removeExp(i)} className="absolute top-3 right-3 text-red-400">
                      <FiTrash2 size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Input label="Job Title" placeholder="Software Engineer" {...register(`experience.${i}.title`)} />
                      <Input label="Company" placeholder="Company name" {...register(`experience.${i}.company`)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Input label="Start" placeholder="2022-01" {...register(`experience.${i}.startDate`)} />
                      <Input label="End" placeholder="2024-06" {...register(`experience.${i}.endDate`)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Description</label>
                      <textarea {...register(`experience.${i}.description`)} rows={2}
                        className={`${ic} resize-none`} style={is} placeholder="What did you do?" />
                    </div>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" {...register(`experience.${i}.isCurrent`)} className="accent-[var(--accent)]" />
                      <span className="text-xs" style={{ color: "var(--text-sub)" }}>Current job</span>
                    </label>
                  </div>
                ))}
              </div>
          }
        </Section>

        <Section title="Education"
          action={
            <button type="button"
              onClick={() => addEdu({ degree:"", institution:"", field:"", startYear:null, endYear:null, isOngoing:false })}
              className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--accent)" }}>
              <FiPlus size={13} /> Add
            </button>
          }>
          {eduFields.length === 0
            ? <p className="text-sm" style={{ color: "var(--text-mute)" }}>No education added yet</p>
            : <div className="space-y-4">
                {eduFields.map((field, i) => (
                  <div key={field.id} className="p-4 rounded-xl border relative"
                    style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                    <button type="button" onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-red-400">
                      <FiTrash2 size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Input label="Degree" placeholder="BSc" {...register(`education.${i}.degree`)} />
                      <Input label="Field" placeholder="Computer Science" {...register(`education.${i}.field`)} />
                    </div>
                    <Input label="Institution" placeholder="University name" {...register(`education.${i}.institution`)} />
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <Input label="Start Year" type="number" placeholder="2018" {...register(`education.${i}.startYear`, { valueAsNumber: true })} />
                      <Input label="End Year" type="number" placeholder="2022" {...register(`education.${i}.endYear`, { valueAsNumber: true })} />
                    </div>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" {...register(`education.${i}.isOngoing`)} className="accent-[var(--accent)]" />
                      <span className="text-xs" style={{ color: "var(--text-sub)" }}>Currently studying</span>
                    </label>
                  </div>
                ))}
              </div>
          }
        </Section>

        <Section title="Links & Portfolio">
          <div className="space-y-3">
            <Input label="GitHub" placeholder="https://github.com/username" {...register("links.github")} />
            <Input label="LinkedIn" placeholder="https://linkedin.com/in/username" {...register("links.linkedin")} />
            <Input label="Portfolio" placeholder="https://yourportfolio.com" {...register("links.portfolio")} />
            <Input label="Other" placeholder="Any other relevant link" {...register("links.other")} />
          </div>
        </Section>

        <Button type="submit" loading={updating} fullWidth>Save Profile</Button>
      </form>
    </div>
  );
}
