import Link from "next/link";
import { FiArrowRight, FiBriefcase, FiUsers } from "react-icons/fi";

export default function CTASection() {
  return (
    <section className="py-20" style={{ background: "var(--bg-muted)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Seekers CTA */}
          <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            }}>
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute bottom-5 right-8 w-20 h-20 rounded-full bg-white/5" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-white/20">
                <FiUsers size={22} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Looking for a Job?
              </h3>
              <p className="text-sm text-blue-100 leading-relaxed mb-6 max-w-sm">
                Create your profile, build a professional resume, and apply to thousands of opportunities with just one click.
              </p>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition hover:opacity-90 bg-white text-blue-600">
                Get Started Free
                <FiArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Employers CTA */}
          <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, #c2410c 100%)",
            }}>
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute bottom-5 right-8 w-20 h-20 rounded-full bg-white/5" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-white/20">
                <FiBriefcase size={22} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Ready to Hire?
              </h3>
              <p className="text-sm text-orange-100 leading-relaxed mb-6 max-w-sm">
                Post your job listings, review applicant resumes, and find the perfect candidate for your team.
              </p>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition hover:opacity-90 bg-white"
                style={{ color: "var(--accent)" }}>
                Post a Job Now
                <FiArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
