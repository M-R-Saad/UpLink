"use client";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function CategoryForm({ category, onClose, onSave }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💼");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setIcon(category.icon || "💼");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md mx-4 p-6 rounded-2xl border shadow-xl"
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
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-sub)" }}>
              Icon (emoji)
            </label>
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-20 px-3 py-2.5 rounded-xl text-center text-lg border outline-none"
              style={{ background: "var(--bg-muted)", borderColor: "var(--border)", color: "var(--text)" }}
            />
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
