import Image from "next/image";
import { cn } from "../../lib/utils";

const sizes = { xs: "w-6 h-6 text-xs", sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg", xl: "w-20 h-20 text-2xl" };

export default function Avatar({ src, name, size = "md", className }) {
  const initials = name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "?";
  return (
    <div className={cn("rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden font-semibold", sizes[size], className)}
      style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
      {src ? (
        <Image src={src} alt={name || "avatar"} width={80} height={80} className="w-full h-full object-cover" />
      ) : initials}
    </div>
  );
}
