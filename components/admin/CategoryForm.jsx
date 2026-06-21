"use client";
import { useState, useEffect, useRef } from "react";
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi";
import CategoryIcon from "../ui/CategoryIcon";
import toast from "react-hot-toast";

export default function CategoryForm({ category, onClose, onSave }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const isEdit = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setIcon(category.icon || "");
      setDescription(category.description || "");
    }
  }, [category]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload PNG, JPG, WebP, SVG, or GIF");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Icon must be under 2MB");
      return;
    }

    // Show local preview
    setPreview(URL.createObjectURL(file));

    // Upload to Cloudinary
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "uplink/categories");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setIcon(json.url);
      toast.success("Icon uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveIcon = () => {
    setIcon("");
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

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

  // What to show in the preview
  const displayIcon = preview || icon;

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
          {/* Icon Upload */}
          <div>
            <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--text-sub)" }}>
              Icon
            </label>

            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                {displayIcon ? (
                  <img src={displayIcon} alt="Icon preview" className="w-full h-full object-contain p-1" />
                ) : (
                  <CategoryIcon size={24} style={{ color: "var(--text-mute)" }} />
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition hover:bg-[var(--bg-muted)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}
                >
                  <FiUpload size={12} />
                  {uploading ? "Uploading..." : "Upload Icon"}
                </button>

                {displayIcon && (
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-red-50"
                    style={{ color: "var(--badge-red)" }}
                  >
                    <FiTrash2 size={12} /> Remove
                  </button>
                )}

                <p className="text-[10px]" style={{ color: "var(--text-mute)" }}>
                  PNG, SVG, JPG, WebP · Max 2MB
                </p>
              </div>
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
            <button type="submit" disabled={saving || uploading || !name.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition"
              style={{ background: "var(--accent)", opacity: (saving || uploading) ? 0.6 : 1 }}>
              {saving ? "Saving..." : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
