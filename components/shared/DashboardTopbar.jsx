"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiArrowLeft } from "react-icons/fi";
import Avatar from "../ui/Avatar";

export default function DashboardTopbar() {
  const { data: session } = useSession();
  return (
    <header className="h-14 border-b flex items-center justify-between px-5 flex-shrink-0"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
      <Link href="/"
        className="flex items-center gap-1.5 text-sm hover:opacity-70 transition"
        style={{ color: "var(--text-sub)" }}>
        <FiArrowLeft size={14} /> Back to site
      </Link>
      {session && (
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{session.user.name}</p>
            <p className="text-xs capitalize" style={{ color: "var(--text-mute)" }}>{session.user.role}</p>
          </div>
          <Avatar src={session.user.photoURL} name={session.user.name} size="sm" />
        </div>
      )}
    </header>
  );
}
