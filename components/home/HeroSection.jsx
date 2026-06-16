"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-muted) 50%, var(--bg) 100%)",
      }} />

      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "var(--accent)" }} />
        <div className="absolute top-40 -left-16 w-64 h-64 rounded-full opacity-[0.03]"
          style={{ background: "var(--accent)" }} />
        <div className="absolute bottom-10 right-1/4 w-40 h-40 rounded-full opacity-[0.04]"
          style={{ background: "var(--accent)" }} />

        {/* Floating grid dots */}
        <div className="absolute top-20 left-20 grid grid-cols-5 gap-3 opacity-[0.08]">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          ))}
        </div>
        <div className="absolute bottom-20 right-20 grid grid-cols-4 gap-3 opacity-[0.06]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide px-4 py-1.5 rounded-full border"
            style={{
              color: "var(--accent)",
              background: "var(--accent-soft)",
              borderColor: "var(--accent)",
              borderWidth: "1px",
              borderStyle: "solid",
              opacity: 0.85,
            }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            Your Career Starts Here
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
          Find Your Next{" "}
          <span className="relative">
            <span style={{ color: "var(--accent)" }}>Opportunity</span>
            <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5.5C40 2 80 1 100 3C120 5 160 6.5 199 2.5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
            </svg>
          </span>
        </h1>

        <p className="text-center text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--text-sub)" }}>
          Discover thousands of job opportunities from top companies.
          Build your resume, apply with ease, and land your dream career.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch}
          className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 p-2 rounded-2xl border shadow-lg"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 flex-1 px-3">
            <FiSearch size={18} style={{ color: "var(--text-mute)", flexShrink: 0 }} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, keyword, or company"
              className="w-full py-2.5 bg-transparent text-sm outline-none"
              style={{ color: "var(--text)" }}
            />
          </div>
          <div className="hidden sm:block w-px self-stretch my-2" style={{ background: "var(--border)" }} />
          <div className="flex items-center gap-2 flex-1 px-3">
            <FiMapPin size={18} style={{ color: "var(--text-mute)", flexShrink: 0 }} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or remote"
              className="w-full py-2.5 bg-transparent text-sm outline-none"
              style={{ color: "var(--text)" }}
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Search Jobs
            <FiArrowRight size={15} />
          </button>
        </form>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs" style={{ color: "var(--text-mute)" }}>
          <span>Popular:</span>
          {["React Developer", "UI/UX Designer", "Data Analyst", "Marketing", "Remote"].map((term) => (
            <Link
              key={term}
              href={`/jobs?search=${encodeURIComponent(term)}`}
              className="px-3 py-1 rounded-full border transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
