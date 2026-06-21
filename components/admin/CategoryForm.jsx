"use client";
import { useState, useEffect } from "react";
import { FiX, FiSearch } from "react-icons/fi";
import CategoryIcon, { AVAILABLE_ICONS } from "../ui/CategoryIcon";

export default function CategoryForm({ category, onClose, onSave }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("FiBriefcase");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      // If existing icon is an emoji (not starting with "Fi"), default to FiBriefcase
      const existingIcon = category.icon || "FiBriefcase";
      setIcon(existingIcon.startsWith("Fi") ? existingIcon : "FiBriefcase");
      setDescription(category.description || "");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isEdit ? `/api/categories/${category._id}` : "/api/categories";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, description }),
      });
      const json = await res.json();
      if (json.success) {
        onSave?.(json.data);
        onClose?.();
      } else {
        alert(json.message);
      }
    } catch {
      alert("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const filteredIcons = iconSearch
    ? AVAILABLE_ICONS.filter((i) =>
        i.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
        i.name.toLowerCase().includes(iconSearch.toLowerCase())
      )
    : AVAILABLE_ICONS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md mx-4 p-6 rounded-2xl border shadow-xl max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold" style={{ color: "var(--text)" }}>
            {isEdit ? "Edit Category" : "Add Category"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--bg-muted)]"
            style={{ color: "var(--text-mute)" }}>
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon Picker */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-sub)" }}>
              Icon
            </label>

            {/* Selected icon preview */}
            <div className="flex items-center gap-3 mb-3 p-3 rounded-xl border"
              style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                <CategoryIcon icon={icon} size={22} />
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                {AVAILABLE_ICONS.find((i) => i.name === icon)?.label || icon}
              </span>
            </div>

            {/* Search */}
            <div className="relative mb-2">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-mute)" }} />
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Search icons..."
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border outline-none"
                style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>

            {/* Icon grid */}
            <div className="grid grid-cols-8 gap-1 max-h-36 overflow-y-auto p-1 rounded-xl border"
              style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
              {filteredIcons.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setIcon(item.name)}
                  className="p-2 rounded-lg transition-all flex items-center justify-center"
                  style={{
                    background: icon === item.name ? "var(--accent)" : "transparent",
                    color: icon === item.name ? "#fff" : "var(--text-sub)",
                  }}
                  title={item.label}
                >
                  <CategoryIcon icon={item.name} size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-sub)" }}>
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Engineering"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none"
              style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-sub)" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border outline-none resize-none"
              style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium transition hover:bg-[var(--bg-muted)]"
              style={{ color: "var(--text-sub)" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving || !name.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition"
              style={{ background: "var(--accent)", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
