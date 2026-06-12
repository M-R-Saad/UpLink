import { notFound } from "next/navigation";
import Link from "next/link";
import { FiMapPin, FiUsers, FiClock, FiEye, FiArrowLeft, FiCalendar } from "react-icons/fi";
import { JobTypeTag, LocationTag } from "../../../../components/jobs/JobTypeTag";
import SalaryRange from "../../../../components/jobs/SalaryRange";
import ApplyButton from "../../../../components/jobs/ApplyButton";
import SaveJobButton from "../../../../components/jobs/SaveJobButton";
import { formatDate, timeAgo } from "../../../../lib/utils";

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res  = await fetch(`${process.env.NEXTAUTH_URL}/api/jobs/${id}`,
      { next: { revalidate: 60 } });
    const json = await res.json();
    if (!json.success) return { title: "Job" };
    return {
      title:       `${json.data.title} at ${json.data.company?.name}`,
      description: json.data.description?.replace(/<[^>]*>/g, "").substring(0, 160),
    };
  } catch {
    return { title: "Job" };
  }
}

async function getJob(id) {
  try {
    const res  = await fetch(`${process.env.NEXTAUTH_URL}/api/jobs/${id}`,
      { cache: "no-store" });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

export default async function JobDetailPage({ params }) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-70 transition"
        style={{ color: "var(--text-sub)" }}>
        <FiArrowLeft size={14} /> Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Job header */}
          <div className="p-6 rounded-2xl border mb-5"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-lg border"
                style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--accent)" }}>
                {job.company?.logo
                  ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  : job.company?.name?.[0]
                }
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/companies/${job.company?._id}`}
                  className="text-sm hover:underline" style={{ color: "var(--text-sub)" }}>
                  {job.company?.name}
                </Link>
                <h1 className="text-xl font-bold mt-0.5 mb-3" style={{ color: "var(--text)" }}>
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <JobTypeTag type={job.jobType} />
                  <LocationTag type={job.locationType} />
                  {job.experience !== "any" && (
                    <span className="text-xs px-2.5 py-0.5 rounded-full capitalize"
                      style={{ background: "var(--bg-muted)", color: "var(--text-sub)" }}>
                      {job.experience} level
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t text-xs"
              style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}>
              {job.company?.location && (
                <span className="flex items-center gap-1">
                  <FiMapPin size={11} />{job.company.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <FiCalendar size={11} />Closes {formatDate(job.deadline)}
              </span>
              <span className="flex items-center gap-1">
                <FiUsers size={11} />{job.vacancies} vacanc{job.vacancies > 1 ? "ies" : "y"}
              </span>
              <span className="flex items-center gap-1">
                <FiEye size={11} />{job.viewCount} views
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 rounded-2xl border mb-5"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Job Description</h2>
            <div className="prose-sm max-w-none text-sm leading-relaxed"
              style={{ color: "var(--text-sub)" }}
              dangerouslySetInnerHTML={{ __html: job.description }} />
          </div>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="p-6 rounded-2xl border mb-5"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"
                    style={{ color: "var(--text-sub)" }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--accent)" }} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="p-6 rounded-2xl border"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h2 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply card */}
          <div className="p-5 rounded-2xl border"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <SalaryRange salary={job.salary} />
            <div className="flex gap-2 mt-4">
              <div className="flex-1">
                <ApplyButton jobId={job._id} jobTitle={job.title} />
              </div>
              <SaveJobButton jobId={job._id} size="lg" />
            </div>
            <p className="text-xs mt-3 text-center" style={{ color: "var(--text-mute)" }}>
              Posted {timeAgo(job.createdAt)}
            </p>
          </div>

          {/* Company card */}
          <div className="p-5 rounded-2xl border"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>About the Company</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm border"
                style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--accent)" }}>
                {job.company?.logo
                  ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  : job.company?.name?.[0]
                }
              </div>
              <p className="font-medium text-sm" style={{ color: "var(--text)" }}>{job.company?.name}</p>
            </div>
            {job.company?.industry && (
              <p className="text-xs mb-1" style={{ color: "var(--text-sub)" }}>{job.company.industry}</p>
            )}
            {job.company?.size && (
              <p className="text-xs" style={{ color: "var(--text-sub)" }}>{job.company.size} employees</p>
            )}
            <Link href={`/companies/${job.company?._id}`}
              className="mt-3 block text-xs font-medium hover:underline"
              style={{ color: "var(--accent)" }}>
              View company profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
