import { FiBriefcase, FiTarget, FiHeart, FiShield, FiGlobe, FiZap } from "react-icons/fi";

export const metadata = {
  title: "About — UpLink",
  description: "Learn about UpLink, the platform connecting talented professionals with great career opportunities across Bangladesh and beyond.",
};

const VALUES = [
  {
    icon: FiTarget,
    title: "Mission-Driven",
    description: "We're on a mission to democratize access to career opportunities and make hiring transparent for everyone.",
    color: "#3b82f6",
  },
  {
    icon: FiHeart,
    title: "People First",
    description: "Every feature we build puts job seekers and employers at the center. Your success is our success.",
    color: "#ef4444",
  },
  {
    icon: FiShield,
    title: "Trust & Safety",
    description: "Verified companies, moderated reviews, and secure data handling — we take trust seriously.",
    color: "#10b981",
  },
  {
    icon: FiGlobe,
    title: "Inclusive Access",
    description: "Open to all professionals regardless of background. We believe talent has no boundaries.",
    color: "#8b5cf6",
  },
  {
    icon: FiZap,
    title: "Innovation",
    description: "From our smart resume builder to real-time job alerts, we use technology to simplify your job search.",
    color: "#f97316",
  },
  {
    icon: FiBriefcase,
    title: "Quality Matches",
    description: "Advanced filtering and category-based browsing ensure you find the right opportunity quickly.",
    color: "#06b6d4",
  },
];

const TEAM_STATS = [
  { value: "2025", label: "Founded" },
  { value: "10+", label: "Categories" },
  { value: "24/7", label: "Job Alerts" },
  { value: "Free", label: "For Seekers" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, var(--bg-muted) 0%, var(--bg) 100%)" }} />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "var(--accent)" }} />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full"
            style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
            Connecting Talent with{" "}
            <span style={{ color: "var(--accent)" }}>Opportunity</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--text-sub)" }}>
            UpLink is a modern job platform built to bridge the gap between talented professionals
            and forward-thinking companies. Whether you&apos;re starting your career or scaling your team,
            we&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEAM_STATS.map(({ value, label }) => (
              <div key={label} className="text-center p-5 rounded-2xl border"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{value}</p>
                <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-mute)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
                style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
                Our Story
              </span>
              <h2 className="text-3xl font-bold mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
                Built for the Modern Workforce
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-sub)" }}>
                UpLink was born from a simple observation: the traditional job search is broken.
                Endless scrolling, impersonal applications, and opaque hiring processes frustrate
                both candidates and employers alike.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
                We set out to build something better — a platform that&apos;s intuitive, transparent,
                and actually helps people find meaningful work. With features like our built-in
                resume builder, real-time job alerts, and company reviews, we&apos;re making
                the job search experience simpler and more human.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "🎯", text: "Smart Matching" },
                { emoji: "📄", text: "Resume Builder" },
                { emoji: "🔔", text: "Job Alerts" },
                { emoji: "⭐", text: "Company Reviews" },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 p-5 rounded-2xl border"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: "var(--bg-muted)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
              style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
              What Drives Us Forward
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, description, color }) => (
              <div key={title}
                className="p-6 rounded-2xl border transition hover:shadow-lg hover:-translate-y-1 duration-300"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}12`, color }}>
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "var(--text)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
