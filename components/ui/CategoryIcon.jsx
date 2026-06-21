import { FiBriefcase } from "react-icons/fi";

/**
 * Renders a category icon.
 * - If `icon` is a URL (starts with http/https or /), renders an <img>.
 * - Otherwise falls back to a default briefcase icon.
 */
export default function CategoryIcon({ icon, size = 20, className = "", style = {} }) {
  const isUrl = icon && (icon.startsWith("http") || icon.startsWith("/") || icon.startsWith("data:"));

  if (isUrl) {
    return (
      <img
        src={icon}
        alt="category"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: "contain", ...style }}
      />
    );
  }

  // Fallback for old emoji icons or missing icons
  return <FiBriefcase size={size} className={className} style={style} />;
}
