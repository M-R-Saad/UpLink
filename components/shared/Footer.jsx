import Link from "next/link";

const LINKS = {
  "For Job Seekers": [
    { href: "/jobs",            label: "Browse Jobs" },
    { href: "/companies",       label: "Companies" },
    { href: "/dashboard/resume",label: "Resume Builder" },
    { href: "/dashboard/alerts",label: "Job Alerts" },
  ],
  "For Employers": [
    { href: "/employer/jobs/new",      label: "Post a Job" },
    { href: "/employer/dashboard",     label: "Dashboard" },
    { href: "/employer/company",       label: "Company Profile" },
  ],
  "Company": [
    { href: "/about",   label: "About" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t mt-20" style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <img src="/uplink_logo_no_bg.png" alt="UpLink" className="w-7 h-7 object-contain" />
              <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
                Up<span style={{ color: "var(--accent)" }}>Link</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-sub)" }}>
              Connecting talented professionals with great opportunities across Bangladesh and beyond.
            </p>
          </div>
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-mute)" }}>
                {group}
              </p>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm hover:text-[var(--accent)] transition"
                      style={{ color: "var(--text-sub)" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t pt-6 flex items-center justify-between text-xs"
          style={{ borderColor: "var(--border)", color: "var(--text-mute)" }}>
          <p>© {new Date().getFullYear()} UpLink. All rights reserved.</p>
          <p>Built with Next.js + MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
