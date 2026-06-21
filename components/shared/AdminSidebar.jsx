"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FiGrid, FiUsers, FiBriefcase, FiTag, FiMessageSquare, FiHome, FiArrowLeft, FiLogOut } from "react-icons/fi";
import { cn } from "../../lib/utils";
import ProfilePhotoUpload from "../ui/ProfilePhotoUpload";

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
  const { data: session } = useSession();

  return (
    <aside className="hidden md:flex flex-col w-60 border-r flex-shrink-0"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      {/* Logo + Admin badge on right */}
      <div className="px-5 py-5 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/uplink_logo_no_bg.png" alt="UpLink" className="w-7 h-7 object-contain" />
          <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
            Up<span style={{ color: "var(--accent)" }}>Link</span>
          </span>
        </Link>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xl border ml-auto"
          style={{ color: "var(--badge-seeker)", background: "var(--badge-seeker-soft)" }}>
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
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

      {/* Bottom section */}
      <div className="px-3 py-3">
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition hover:bg-[var(--bg-muted)] mb-2"
          style={{ color: "var(--text-sub)" }}>
          <FiArrowLeft size={15} />
          Back to site
        </Link>

        {session && (
          <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3 px-3 py-2">
              <ProfilePhotoUpload
                currentPhoto={session.user.photoURL}
                userName={session.user.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{session.user.name}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-mute)" }}>{session.user.email}</p>
              </div>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-muted)] transition"
                style={{ color: "var(--text-mute)" }} title="Sign out">
                <FiLogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
