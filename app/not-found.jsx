import Link from "next/link";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: "var(--bg)" }}>
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-6xl font-bold mb-2" style={{ color: "var(--accent)" }}>404</h1>
      <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>Page Not Found</h2>
      <p className="text-sm mb-8 max-w-xs" style={{ color: "var(--text-sub)" }}>
        This page doesn&apos;t exist. Let&apos;s get you back to finding great opportunities.
      </p>
      <Button>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
