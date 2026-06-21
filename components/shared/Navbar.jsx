"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiSun, FiMoon, FiChevronDown } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

const NAV_LINKS = [
  { href: "/jobs",      label: "Find Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/about",     label: "About" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { dark, toggle } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dashboardHref =
    session?.user?.role === "employer" ? "/employer/dashboard"
    : session?.user?.role === "admin"   ? "/admin"
    : "/dashboard";

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <img src="/uplink_logo_no_bg.png" alt="UpLink" className="w-8 h-8 object-contain" />
          <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
            Up<span style={{ color: "var(--accent)" }}>Link</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition hover:opacity-70"
                style={{ color: pathname === link.href ? "var(--accent)" : "var(--text-sub)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg transition hover:bg-[var(--bg-muted)]"
            style={{ color: "var(--text-sub)" }}
          >
            {dark ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--bg-muted)] transition"
              >
                <Avatar src={session.user.photoURL} name={session.user.name} size="sm" />
                <span className="text-sm font-medium hidden md:block" style={{ color: "var(--text)" }}>
                  {session.user.name?.split(" ")[0]}
                </span>
                <FiChevronDown size={13} style={{ color: "var(--text-mute)" }} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl shadow-lg border py-1 z-50"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                  <Link href={dashboardHref} onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-[var(--bg-muted)] transition"
                    style={{ color: "var(--text)" }}>
                    Dashboard
                  </Link>
                  {session.user.role === "jobseeker" && (
                    <Link href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-[var(--bg-muted)] transition"
                      style={{ color: "var(--text)" }}>
                      Profile
                    </Link>
                  )}
                  <hr className="my-1" style={{ borderColor: "var(--border)" }} />
                  <button onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[var(--bg-muted)] transition">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => {}}>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm">
                <Link href="/register">Post a Job</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-muted)] transition"
            style={{ color: "var(--text-sub)" }}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 pb-4 pt-2"
          style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium"
              style={{ color: pathname === link.href ? "var(--accent)" : "var(--text-sub)" }}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
