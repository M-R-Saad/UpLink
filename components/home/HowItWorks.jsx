import { FiUser, FiSearch, FiSend } from "react-icons/fi";

const STEPS = [
  {
    icon: FiUser,
    title: "Create Your Profile",
    description: "Sign up and build your professional profile with our intuitive resume builder. Showcase your skills and experience.",
    color: "#3b82f6",
    step: "01",
  },
  {
    icon: FiSearch,
    title: "Discover Opportunities",
    description: "Browse thousands of curated job listings. Filter by category, type, location, and salary to find your perfect match.",
    color: "#8b5cf6",
    step: "02",
  },
  {
    icon: FiSend,
    title: "Apply & Get Hired",
    description: "Apply with one click using your saved resume. Track your applications and get hired by top companies.",
    color: "#10b981",
    step: "03",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
            Land Your Dream Job in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ icon: Icon, title, description, color, step }, idx) => (
            <div key={step} className="relative group">
              {/* Connector line */}
              {idx < 2 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px z-0"
                  style={{ background: "var(--border)" }} />
              )}

              <div className="relative p-6 rounded-2xl border transition hover:shadow-lg hover:-translate-y-1 duration-300"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                {/* Step number */}
                <span className="absolute -top-3 -right-2 text-5xl font-black opacity-[0.06]"
                  style={{ color, fontFamily: "'Inter', sans-serif" }}>
                  {step}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `${color}12`, color }}>
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
