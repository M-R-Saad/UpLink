"use client";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { cn } from "../../lib/utils";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl", xl: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full rounded-2xl shadow-2xl z-10", sizes[size])}
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="font-semibold text-base" style={{ color: "var(--text)" }}>{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--bg-muted)] transition" style={{ color: "var(--text-mute)" }}>
              <FiX size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
