import Link from "next/link";
import { FiHome, FiArrowRight } from "react-icons/fi";

async function getTopCompanies() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/companies?limit=8`,
      { next: { revalidate: 600 } }
    );
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function TopCompanies() {
  const companies = await getTopCompanies();
  if (!companies.length) return null;

  return (
    <section className="py-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-2 px-3 py-1 rounded-full"
              style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
              Top Employers
            </span>
            <h2 className="text-3xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
              Companies Hiring Now
            </h2>
          </div>
          <Link href="/companies"
            className="text-sm font-medium hover:underline hidden md:flex items-center gap-1"
            style={{ color: "var(--accent)" }}>
            View all <FiArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Link
              key={company._id}
              href={`/companies/${company._id}`}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border text-center transition hover:shadow-lg hover:-translate-y-1 duration-200 group"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                style={{ background: "var(--bg-muted)" }}>
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <FiHome size={22} style={{ color: "var(--text-mute)" }} />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold truncate group-hover:text-[var(--accent)] transition"
                  style={{ color: "var(--text)" }}>
                  {company.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-mute)" }}>
                  {company.industry || "Technology"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/companies"
            className="text-sm font-medium hover:underline inline-flex items-center gap-1"
            style={{ color: "var(--accent)" }}>
            View all companies <FiArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
