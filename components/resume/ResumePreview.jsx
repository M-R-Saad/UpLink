"use client";
import { useResumeStore } from "../../store/useResumeStore";
import { FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiGlobe, FiLink } from "react-icons/fi";

export default function ResumePreview() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, links } = data;

  const hasContent =
    personalInfo.name || experience.length > 0 || education.length > 0 || skills.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full rounded-2xl border border-dashed p-8"
        style={{ borderColor: "var(--border)" }}>
        <div className="text-center">
          <div className="text-4xl mb-3 opacity-30">📄</div>
          <p className="text-sm font-medium" style={{ color: "var(--text-mute)" }}>
            Your resume preview will appear here
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
            Start filling in your details on the left
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "#fff" }}>
      {/* Resume document — always white background for print fidelity */}
      <div className="p-6 sm:p-8 text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* Header */}
        <div className="border-b-2 pb-5 mb-5" style={{ borderColor: "#e8520a" }}>
          {personalInfo.name && (
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
              {personalInfo.name}
            </h1>
          )}
          {personalInfo.headline && (
            <p className="text-sm font-medium mt-1" style={{ color: "#e8520a" }}>
              {personalInfo.headline}
            </p>
          )}

          {/* Contact Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
            {personalInfo.email && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "#555" }}>
                <FiMail size={11} /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "#555" }}>
                <FiPhone size={11} /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "#555" }}>
                <FiMapPin size={11} /> {personalInfo.location}
              </span>
            )}
          </div>

          {/* Links Row */}
          {(links.github || links.linkedin || links.portfolio || links.other) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {links.github && (
                <span className="flex items-center gap-1 text-xs" style={{ color: "#555" }}>
                  <FiGithub size={11} /> {links.github.replace(/https?:\/\/(www\.)?/, "")}
                </span>
              )}
              {links.linkedin && (
                <span className="flex items-center gap-1 text-xs" style={{ color: "#555" }}>
                  <FiLinkedin size={11} /> {links.linkedin.replace(/https?:\/\/(www\.)?/, "")}
                </span>
              )}
              {links.portfolio && (
                <span className="flex items-center gap-1 text-xs" style={{ color: "#555" }}>
                  <FiGlobe size={11} /> {links.portfolio.replace(/https?:\/\/(www\.)?/, "")}
                </span>
              )}
              {links.other && (
                <span className="flex items-center gap-1 text-xs" style={{ color: "#555" }}>
                  <FiLink size={11} /> {links.other.replace(/https?:\/\/(www\.)?/, "")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {personalInfo.bio && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#e8520a" }}>
              Summary
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: "#333" }}>
              {personalInfo.bio}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#e8520a" }}>
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                        {exp.title || "Untitled Position"}
                      </p>
                      <p className="text-xs" style={{ color: "#555" }}>
                        {[exp.company, exp.location].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: "#888" }}>
                      {exp.startDate || "–"} — {exp.isCurrent ? "Present" : exp.endDate || "–"}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#444" }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#e8520a" }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                      {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Untitled"}
                    </p>
                    <p className="text-xs" style={{ color: "#555" }}>
                      {edu.institution || "Institution"}
                    </p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: "#888" }}>
                    {edu.startYear || "–"} — {edu.isOngoing ? "Present" : edu.endYear || "–"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#e8520a" }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span key={skill}
                  className="text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{ background: "#fff1e8", color: "#c44a0a" }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
