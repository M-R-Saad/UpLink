import Link from "next/link";
import CategoryIcon from "../ui/CategoryIcon";

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/categories`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <section className="py-20" style={{ background: "var(--bg-muted)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
            Browse by Category
          </span>
          <h2 className="text-3xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
            Explore Job Categories
          </h2>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-sm" style={{ color: "var(--text-mute)" }}>
            No categories yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/jobs?category=${cat._id}`}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl border text-center transition hover:shadow-md hover:-translate-y-1 duration-200"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-1"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                  <CategoryIcon icon={cat.icon} size={22} />
                </div>
                <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                  {cat.name}
                </span>
                {cat.jobCount > 0 && (
                  <span className="text-xs" style={{ color: "var(--text-mute)" }}>
                    {cat.jobCount} jobs
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
