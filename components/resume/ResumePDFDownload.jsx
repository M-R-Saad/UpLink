"use client";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ResumePDF from "./ResumePDF";
import Button from "../ui/Button";
import { FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ResumePDFDownload({ data }) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!data?.personalInfo?.name) {
      toast.error("Please fill in your name before downloading");
      return;
    }

    setGenerating(true);
    try {
      const blob = await pdf(<ResumePDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Resume downloaded!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} loading={generating}>
      <FiDownload size={14} /> Download PDF
    </Button>
  );
}
