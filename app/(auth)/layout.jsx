import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, var(--bg) 0%, var(--bg-muted) 40%, var(--bg) 70%, var(--accent-soft) 100%)" }} />

      {/* Decorative floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #16e0ed 0%, transparent 70%)" }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-[0.03]"
          style={{ background: "var(--accent)" }} />

        {/* Grid dots */}
        <div className="absolute top-16 right-16 grid grid-cols-6 gap-4 opacity-[0.06]">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          ))}
        </div>
        <div className="absolute bottom-16 left-16 grid grid-cols-4 gap-4 opacity-[0.05]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: "#16e0ed" }} />
          ))}
        </div>
      </div>

      {/* Logo */}
      <Link href="/" className="relative flex items-center gap-2.5 font-bold text-2xl mb-8">
        <img src="/uplink_logo_no_bg.png" alt="UpLink" className="w-10 h-10 object-contain" />
        <span style={{ fontFamily: "'Playfair Display', serif", color: "var(--text)" }}>
          Up<span style={{ color: "var(--accent)" }}>Link</span>
        </span>
      </Link>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-2xl border p-8"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px var(--border)",
        }}>
        {children}
      </div>
    </div>
  );
}
