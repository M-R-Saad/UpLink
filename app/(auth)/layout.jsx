import Link from "next/link";
import { FiBriefcase } from "react-icons/fi";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
          style={{ background: "var(--accent)" }}>
          <FiBriefcase size={16} />
        </div>
        <span style={{ color: "var(--text)" }}>Up</span>
        <span style={{ color: "var(--accent)" }}>Link</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border p-8 shadow-sm"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
        {children}
      </div>
    </div>
  );
}
