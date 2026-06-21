"use client";
import { useState, useRef } from "react";
import { FiCamera, FiX, FiUpload } from "react-icons/fi";
import Avatar from "./Avatar";
import toast from "react-hot-toast";

export default function ProfilePhotoUpload({ currentPhoto, userName, onUploaded }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "uplink/avatars");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) throw new Error(uploadJson.message);

      // 2. Update user record
      const updateRes = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoURL: uploadJson.url }),
      });
      const updateJson = await updateRes.json();
      if (!updateJson.success) throw new Error(updateJson.message);

      toast.success("Profile photo updated! Changes will apply on next sign-in.");
      onUploaded?.(uploadJson.url);
      handleClose();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoURL: "" }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success("Photo removed! Changes will apply on next sign-in.");
      onUploaded?.(null);
      handleClose();
    } catch (err) {
      toast.error(err.message || "Failed to remove photo");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
    setFile(null);
  };

  return (
    <>
      {/* Trigger — clickable avatar with camera overlay */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative group cursor-pointer"
        title="Change profile photo"
      >
        <Avatar src={currentPhoto} name={userName} size="lg" />
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <FiCamera size={18} className="text-white" />
        </div>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
          <div
            className="w-full max-w-sm mx-4 p-6 rounded-2xl border shadow-xl"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold" style={{ color: "var(--text)" }}>
                Profile Photo
              </h3>
              <button onClick={handleClose} className="p-1 rounded-lg hover:bg-[var(--bg-muted)]"
                style={{ color: "var(--text-mute)" }}>
                <FiX size={18} />
              </button>
            </div>

            {/* Preview area */}
            <div className="flex flex-col items-center gap-4 mb-5">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 flex items-center justify-center"
                style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : currentPhoto ? (
                  <img src={currentPhoto} alt="Current" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                    {userName?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition hover:bg-[var(--bg-muted)]"
                style={{ borderColor: "var(--border)", color: "var(--text-sub)" }}
              >
                <FiUpload size={14} /> Choose Image
              </button>
              <p className="text-xs" style={{ color: "var(--text-mute)" }}>
                JPG, PNG or WebP · Max 5MB
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-2">
              {currentPhoto && !preview && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition"
                  style={{ color: "var(--badge-red)" }}
                >
                  Remove Photo
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button type="button" onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition hover:bg-[var(--bg-muted)]"
                  style={{ color: "var(--text-sub)" }}>
                  Cancel
                </button>
                {preview && (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition"
                    style={{ background: "var(--accent)", opacity: uploading ? 0.6 : 1 }}
                  >
                    {uploading ? "Uploading..." : "Save Photo"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
