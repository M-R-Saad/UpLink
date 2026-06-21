"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryIcon from "../ui/CategoryIcon";

const JOB_TYPES     = ["full-time","part-time","contract","internship","freelance"];
const LOCATION_TYPES= ["onsite","remote","hybrid"];
const EXPERIENCE    = ["entry","mid","senior","lead"];

const FilterGroup = ({ title, items, filterKey, labelFn, renderLabel, currentVal, onToggle }) => (
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-widest mb-2"
      style={{ color: "var(--text-mute)" }}>{title}</p>
    <div className="space-y-1">
      {items.map((item) => {
        const val    = typeof item === "string" ? item : item._id;
        const label  = labelFn ? labelFn(item) : item;
        const active = currentVal === val;
        return (
          <button key={val}
            onClick={() => onToggle(filterKey, active ? "" : val)}
            className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition capitalize flex items-center gap-2"
            style={{
              background: active ? "var(--accent-soft)" : "transparent",
              color:      active ? "var(--accent)"      : "var(--text-sub)",
              fontWeight: active ? 600                  : 400,
            }}>
            {renderLabel ? renderLabel(item) : label}
          </button>
        );
      })}
    </div>
  </div>
);

export default function JobFilters({ categories = [] }) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else       params.delete(key);
    params.set("page", "1");
    router.push(`/jobs?${params.toString()}`);
  };

  const current = (key) => searchParams.get(key) || "";
  const clearAll = () => router.push("/jobs");

  const hasFilters = ["category","type","locationType","experience"]
    .some((k) => searchParams.get(k));

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>Filters</p>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs hover:underline"
            style={{ color: "var(--accent)" }}>
            Clear all
          </button>
        )}
      </div>
      {categories.length > 0 && (
        <FilterGroup
          title="Category" filterKey="category" items={categories}
          renderLabel={(c) => (
            <>
              <CategoryIcon icon={c.icon} size={14} />
              {c.name}
            </>
          )}
          currentVal={current("category")}
          onToggle={updateFilter}
        />
      )}
      <FilterGroup title="Job Type"     filterKey="type"         items={JOB_TYPES}      currentVal={current("type")} onToggle={updateFilter} />
      <FilterGroup title="Work Mode"    filterKey="locationType" items={LOCATION_TYPES}  currentVal={current("locationType")} onToggle={updateFilter} />
      <FilterGroup title="Experience"   filterKey="experience"   items={EXPERIENCE}      currentVal={current("experience")} onToggle={updateFilter} />
    </aside>
  );
}
