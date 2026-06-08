"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiUsers, FiBriefcase, FiTag, FiMessageSquare, FiHome } from "react-icons/fi";
import { cn } from "../../lib/utils";

const LINKS = [
  { href: "/admin",            label: "Overview",   icon: FiGrid },
  { href: "/admin/users",      label: "Users",      icon: FiUsers },
  { href: "/admin/companies",  label: "Companies",  icon: FiHome },
  { href: "/admin/jobs",       label: "Jobs",       icon: FiBriefcase },
  { href: "/admin/categories", label: "Categories", icon: FiTag },
  { href: "/admin/reviews",    label: "Reviews",    icon: FiMessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-56 border-r flex-shrink-0 py-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="px-5 mb-5">
        <span className="text-xs font-semibold uppercase tracking-widest px-2 py-1 rounded-lg"
          style={{ color: "var(--accent)", background: "var(--accent-soft)" }}>
          Admin Panel
        </span>
      </div>
      <nav className="px-3 space-y-0.5">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                active ? "text-white" : "hover:bg-[var(--bg-muted)]")}
              style={active ? { background: "var(--accent)" } : { color: "var(--text-sub)" }}>
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
