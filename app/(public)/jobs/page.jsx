import { Suspense } from "react";
import JobCard from "../../../components/jobs/JobCard";
import JobFilters from "../../../components/jobs/JobFilters";
import JobSearch from "../../../components/jobs/JobSearch";
import ClientPagination from "../../../components/jobs/ClientPagination";

export const metadata = { title: "Browse Jobs" };

async function getJobs(searchParams) {
  try {
    const params = new URLSearchParams();
    ["search","category","type","locationType","location","experience","page"].forEach((k) => {
      if (searchParams[k]) params.set(k, searchParams[k]);
    });
    params.set("limit", "12");
    const res  = await fetch(`${process.env.NEXTAUTH_URL}/api/jobs?${params}`,
      { cache: "no-store" });
    return await res.json();
  } catch {
    return { data: [], pagination: { total: 0, pages: 1, page: 1 } };
  }
}

async function getCategories() {
  try {
    const res  = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`,
      { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.data || [];
  } catch { return []; }
}

export default async function JobsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const [result, categories] = await Promise.all([getJobs(resolvedSearchParams), getCategories()]);
  const jobs       = result.data       || [];
  const pagination = result.pagination || { total: 0, pages: 1, page: 1 };
  const page       = Number(resolvedSearchParams?.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
          Find Your Next Role
        </h1>
        <Suspense><JobSearch /></Suspense>
      </div>

      <div className="flex gap-8">
        <Suspense><JobFilters categories={categories} /></Suspense>

        <div className="flex-1 min-w-0">
          <p className="text-sm mb-4" style={{ color: "var(--text-sub)" }}>
            {pagination.total} job{pagination.total !== 1 ? "s" : ""} found
          </p>

          {jobs.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border"
              style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
              <p className="text-lg font-medium mb-1" style={{ color: "var(--text)" }}>No jobs found</p>
              <p className="text-sm" style={{ color: "var(--text-sub)" }}>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => <JobCard key={job._id} job={job} />)}
              </div>
              {pagination.pages > 1 && (
                <Suspense><ClientPagination page={page} pages={pagination.pages} /></Suspense>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
