import {
  FiBriefcase, FiCode, FiDollarSign, FiTrendingUp, FiPenTool,
  FiHeart, FiBook, FiTruck, FiShield, FiSettings, FiHeadphones,
  FiCamera, FiFilm, FiMusic, FiGlobe, FiDatabase, FiCpu,
  FiSmartphone, FiMonitor, FiLayers, FiPackage, FiAward,
  FiClipboard, FiBarChart2, FiUsers, FiHome, FiMapPin,
  FiStar, FiZap, FiTarget, FiFeather, FiEdit, FiShoppingCart,
  FiServer, FiWifi, FiCloud, FiLock, FiMail, FiMessageSquare,
  FiGrid, FiTool, FiCoffee, FiCompass, FiAnchor, FiActivity,
} from "react-icons/fi";

// Map of icon name strings → React Icon components
const ICON_MAP = {
  FiBriefcase, FiCode, FiDollarSign, FiTrendingUp, FiPenTool,
  FiHeart, FiBook, FiTruck, FiShield, FiSettings, FiHeadphones,
  FiCamera, FiFilm, FiMusic, FiGlobe, FiDatabase, FiCpu,
  FiSmartphone, FiMonitor, FiLayers, FiPackage, FiAward,
  FiClipboard, FiBarChart2, FiUsers, FiHome, FiMapPin,
  FiStar, FiZap, FiTarget, FiFeather, FiEdit, FiShoppingCart,
  FiServer, FiWifi, FiCloud, FiLock, FiMail, FiMessageSquare,
  FiGrid, FiTool, FiCoffee, FiCompass, FiAnchor, FiActivity,
};

// Curated list with labels for the admin icon picker
export const AVAILABLE_ICONS = [
  { name: "FiBriefcase",    label: "Briefcase" },
  { name: "FiCode",         label: "Code" },
  { name: "FiDollarSign",   label: "Finance" },
  { name: "FiTrendingUp",   label: "Marketing" },
  { name: "FiPenTool",      label: "Design" },
  { name: "FiHeart",        label: "Healthcare" },
  { name: "FiBook",         label: "Education" },
  { name: "FiTruck",        label: "Logistics" },
  { name: "FiShield",       label: "Security" },
  { name: "FiSettings",     label: "Engineering" },
  { name: "FiHeadphones",   label: "Support" },
  { name: "FiCamera",       label: "Photography" },
  { name: "FiFilm",         label: "Film" },
  { name: "FiMusic",        label: "Music" },
  { name: "FiGlobe",        label: "Web" },
  { name: "FiDatabase",     label: "Data" },
  { name: "FiCpu",          label: "Hardware" },
  { name: "FiSmartphone",   label: "Mobile" },
  { name: "FiMonitor",      label: "Desktop" },
  { name: "FiLayers",       label: "Layers" },
  { name: "FiPackage",      label: "Product" },
  { name: "FiAward",        label: "Awards" },
  { name: "FiClipboard",    label: "Management" },
  { name: "FiBarChart2",    label: "Analytics" },
  { name: "FiUsers",        label: "HR" },
  { name: "FiHome",         label: "Real Estate" },
  { name: "FiMapPin",       label: "Location" },
  { name: "FiStar",         label: "Premium" },
  { name: "FiZap",          label: "Energy" },
  { name: "FiTarget",       label: "Sales" },
  { name: "FiFeather",      label: "Writing" },
  { name: "FiEdit",         label: "Content" },
  { name: "FiShoppingCart",  label: "E-Commerce" },
  { name: "FiServer",       label: "DevOps" },
  { name: "FiWifi",         label: "Networking" },
  { name: "FiCloud",        label: "Cloud" },
  { name: "FiLock",         label: "Cyber" },
  { name: "FiMail",         label: "Communications" },
  { name: "FiMessageSquare", label: "Chat" },
  { name: "FiGrid",         label: "Grid" },
  { name: "FiTool",         label: "Tools" },
  { name: "FiCoffee",       label: "Food" },
  { name: "FiCompass",      label: "Travel" },
  { name: "FiAnchor",       label: "Maritime" },
  { name: "FiActivity",     label: "Health" },
];

/**
 * Renders a Feather icon from an icon name string.
 * Falls back to FiBriefcase if the name is unrecognized or is an emoji.
 */
export default function CategoryIcon({ icon, size = 20, className = "", style = {} }) {
  const IconComponent = ICON_MAP[icon] || FiBriefcase;
  return <IconComponent size={size} className={className} style={style} />;
}
