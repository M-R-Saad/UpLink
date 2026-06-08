"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiMapPin } from "react-icons/fi";

export default function JobSearch({ compact = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword]   = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (keyword)  params.set("search",   keyword);
    else          params.delete("search");
    if (location) params.set("location", location);
    else          params.delete("location");
    params.set("page", "1");
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch}
      className={`flex gap-2 ${compact ? "" : "flex-col sm:flex-row"}`}>
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={15}
          style={{ color: "var(--text-mute)" }} />
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Job title, skills, company..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text)" }}
        />
      </div>
      {!compact && (
        <div className="relative flex-1">
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2" size={15}
            style={{ color: "var(--text-mute)" }} />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text)" }}
          />
        </div>
      )}
      <button type="submit"
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 flex-shrink-0"
        style={{ background: "var(--accent)" }}>
        Search
      </button>
    </form>
  );
}
