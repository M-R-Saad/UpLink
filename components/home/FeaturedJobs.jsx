import Link from "next/link";
import JobCard from "../jobs/JobCard";

async function getFeaturedJobs() {
  try {
    const res  = await fetch(
      `${process.env.NEXTAUTH_URL}/api/jobs?featured=true&limit=6`,
      { next: { revalidate: 300 } }
    );
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

export default async function FeaturedJobs() {
  const jobs = await getFeaturedJobs();
  if (!jobs.length) return null;

  return (
    <section className="py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-2 px-3 py-1 rounded-full"
              style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
              Featured
            </span>
            <h2 className="text-3xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
              Latest Opportunities
            </h2>
          </div>
          <Link href="/jobs"
            className="text-sm font-medium hover:underline hidden md:block"
            style={{ color: "var(--accent)" }}>
            View all jobs →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
        <div className="text-center mt-8 md:hidden">
          <Link href="/jobs"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}>
            View all jobs →
          </Link>
        </div>
      </div>
    </section>
  );
}
