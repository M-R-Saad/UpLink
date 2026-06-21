import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiUsers } from "react-icons/fi";

export const metadata = { title: "Companies" };

async function getCompanies(search = "") {
  try {
    const params = new URLSearchParams({ limit: "24" });
    if (search) params.set("search", search);
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/companies?${params}`,
      { next: { revalidate: 60 } }
    );
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function CompaniesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const companies = await getCompanies(resolvedSearchParams?.search);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
          Top Companies
        </h1>
        <p className="text-sm" style={{ color: "var(--text-sub)" }}>
          Discover great places to work
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-medium mb-1" style={{ color: "var(--text)" }}>No companies yet</p>
          <p className="text-sm" style={{ color: "var(--text-sub)" }}>Check back soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {companies.map((company) => (
            <Link key={company._id} href={`/companies/${company._id}`}
              className="flex flex-col items-center p-6 rounded-2xl border text-center transition hover:shadow-md hover:-translate-y-1 duration-200"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 flex items-center justify-center text-2xl font-bold border"
                style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--accent)" }}>
                {company.logo
                  ? <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  : company.name[0]
                }
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>{company.name}</h3>
              <p className="text-xs mb-3" style={{ color: "var(--text-sub)" }}>{company.industry}</p>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-mute)" }}>
                {company.location && (
                  <span className="flex items-center gap-1"><FiMapPin size={10} />{company.location}</span>
                )}
                {company.size && (
                  <span className="flex items-center gap-1"><FiUsers size={10} />{company.size}</span>
                )}
              </div>
              {company.ratings.count > 0 && (
                <p className="text-xs mt-2" style={{ color: "var(--accent)" }}>
                  ★ {company.ratings.average.toFixed(1)} ({company.ratings.count})
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
