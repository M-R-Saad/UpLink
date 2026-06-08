import { FiMapPin, FiUsers, FiGlobe, FiCalendar } from "react-icons/fi";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/companies/${id}`,
      { next: { revalidate: 60 } });
    const json = await res.json();
    if (!json.success) return { title: "Company" };
    return {
      title: json.data.name,
      description: json.data.description?.substring(0, 160),
    };
  } catch {
    return { title: "Company" };
  }
}

async function getCompany(id) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/companies/${id}`,
      { next: { revalidate: 60 } });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export default async function CompanyPage({ params }) {
  const { id } = await params;
  const company = await getCompany(id);
  if (!company) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-start gap-6 mb-10 p-6 rounded-2xl border"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl font-bold border"
          style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--accent)" }}>
          {company.logo
            ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            : company.name[0]
          }
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>{company.name}</h1>
          <p className="text-sm mb-3" style={{ color: "var(--text-sub)" }}>{company.industry}</p>
          <div className="flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-mute)" }}>
            {company.location && (
              <span className="flex items-center gap-1"><FiMapPin size={11} />{company.location}</span>
            )}
            {company.size && (
              <span className="flex items-center gap-1"><FiUsers size={11} />{company.size} employees</span>
            )}
            {company.founded && (
              <span className="flex items-center gap-1"><FiCalendar size={11} />Founded {company.founded}</span>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline" style={{ color: "var(--accent)" }}>
                <FiGlobe size={11} />Website
              </a>
            )}
          </div>
        </div>
        {company.ratings.count > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
              ★ {company.ratings.average.toFixed(1)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-mute)" }}>
              {company.ratings.count} reviews
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {company.description && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>About</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
            {company.description}
          </p>
        </div>
      )}

      {/* Placeholders for jobs and reviews — added in later phases */}
      <div className="rounded-2xl border p-8 text-center"
        style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
        <p className="text-sm" style={{ color: "var(--text-mute)" }}>
          Job listings and reviews will appear here once jobs are posted.
        </p>
      </div>
    </div>
  );
}
