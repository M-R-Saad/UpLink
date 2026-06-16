"use client";
import { useState, useRef } from "react";

export default function Tooltip({ children, text, position = "top" }) {
  const [visible, setVisible] = useState(false);
  const timeout = useRef(null);

  const show = () => {
    timeout.current = setTimeout(() => setVisible(true), 200);
  };
  const hide = () => {
    clearTimeout(timeout.current);
    setVisible(false);
  };

  const posStyles = {
    top: { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    left: { right: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
    right: { left: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
  };

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && text && (
        <span
          className="absolute z-50 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none"
          style={{
            background: "var(--text)",
            color: "var(--bg)",
            ...posStyles[position],
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
