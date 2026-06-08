// useUpload — implement with TanStack Query
"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (file, folder = "uplink") => {
    if (!file) return null;
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setProgress(100);
      return json.url;
    } catch (err) {
      toast.error(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress };
}
