import { FiUsers, FiBriefcase, FiHome, FiCheckCircle } from "react-icons/fi";

async function getStats() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/home/stats`,
      { next: { revalidate: 300 } }
    );
    const json = await res.json();
    return json.data || {};
  } catch {
    return {};
  }
}

const STATS = [
  { key: "totalJobs", label: "Active Jobs", icon: FiBriefcase, color: "#10b981" },
  { key: "totalCompanies", label: "Companies", icon: FiHome, color: "#8b5cf6" },
  { key: "totalSeekers", label: "Job Seekers", icon: FiUsers, color: "#3b82f6" },
  { key: "totalApplications", label: "Applications Sent", icon: FiCheckCircle, color: "#f97316" },
];

function formatNum(n) {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k+`;
  return n.toLocaleString();
}

export default async function StatsSection() {
  const stats = await getStats();

  return (
    <section className="py-4 -mt-8 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ key, label, icon: Icon, color }) => (
            <div
              key={key}
              className="flex items-center gap-3 p-5 rounded-2xl border transition hover:shadow-md"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}12`, color }}
              >
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {formatNum(stats[key])}
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--text-mute)" }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
