"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiFileText, FiBookmark, FiBell, FiUser, FiEdit } from "react-icons/fi";
import { cn } from "../../lib/utils";

const LINKS = [
  { href: "/dashboard",              label: "Overview",     icon: FiGrid },
  { href: "/dashboard/applications", label: "Applications", icon: FiFileText },
  { href: "/dashboard/saved",        label: "Saved Jobs",   icon: FiBookmark },
  { href: "/dashboard/alerts",       label: "Job Alerts",   icon: FiBell },
  { href: "/dashboard/profile",      label: "Profile",      icon: FiUser },
  { href: "/dashboard/resume",       label: "Resume",       icon: FiEdit },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-56 border-r flex-shrink-0 py-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
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
