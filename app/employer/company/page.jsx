"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiUpload, FiGlobe, FiLinkedin, FiTwitter } from "react-icons/fi";
import { createCompanySchema } from "../../../schemas/companySchemas";
import { useUpload } from "../../../hooks/useUpload";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Select from "../../../components/ui/Select";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "E-commerce",
  "Media & Entertainment", "Manufacturing", "Real Estate", "Consulting",
  "Telecommunications", "Logistics", "Non-profit", "Government", "Other",
];

const SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export default function CompanyPage() {
  const { data: session } = useSession();
  const { upload, uploading } = useUpload();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(createCompanySchema),
  });

  const fetchCompany = useCallback(async () => {
    try {
      const res = await fetch("/api/companies/mine");
      const json = await res.json();
      if (json.success && json.data) {
        setCompany(json.data);
        setLogoPreview(json.data.logo);
        reset({
          name:        json.data.name,
          description: json.data.description,
          industry:    json.data.industry,
          size:        json.data.size,
          founded:     json.data.founded,
          website:     json.data.website,
          location:    json.data.location,
          socialLinks: json.data.socialLinks,
        });
      }
    } catch {
      // No company yet
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompany();
  }, [fetchCompany]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let logoURL = company?.logo || null;
      if (logoFile) {
        logoURL = await upload(logoFile, "uplink/logos");
        if (!logoURL) { setSaving(false); return; }
      }

      const payload = { ...data, logo: logoURL };
      const url    = company ? `/api/companies/${company._id}` : "/api/companies";
      const method = company ? "PATCH" : "POST";

      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success) { toast.error(json.message); return; }

      toast.success(company ? "Company updated!" : "Company created! Awaiting admin approval.");
      setCompany(json.data);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          {company ? "Edit Company Profile" : "Create Company Profile"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-sub)" }}>
          {company
            ? company.isApproved
              ? "Your company is approved and visible publicly."
              : "Your company is pending admin approval."
            : "Create your company profile to start posting jobs."
          }
        </p>
      </div>

      {/* Approval status banner */}
      {company && !company.isApproved && (
        <div className="mb-6 px-4 py-3 rounded-xl border text-sm"
          style={{ background: "var(--accent-soft)", borderColor: "var(--accent)", color: "var(--accent)" }}>
          ⏳ Your company is awaiting admin approval before jobs can be posted publicly.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo upload */}
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Company Logo</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ borderColor: "var(--border)", background: "var(--bg-muted)" }}>
              {logoPreview
                ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" />
                : <FiUpload size={20} style={{ color: "var(--text-mute)" }} />
              }
            </div>
            <div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition hover:opacity-80"
                  style={{ borderColor: "var(--border)", color: "var(--text-sub)", background: "var(--bg-card)" }}>
                  <FiUpload size={13} />
                  {uploading ? "Uploading..." : "Upload Logo"}
                </span>
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
              <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>PNG or JPG, max 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-1 gap-4">
          <Input label="Company Name" placeholder="e.g. TechCorp BD" error={errors.name?.message} {...register("name")} />
          <Textarea label="Description" placeholder="Tell job seekers about your company..." rows={4} error={errors.description?.message} {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Industry</label>
            <select
              {...register("industry")}
              className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ borderColor: errors.industry ? "#f87171" : "var(--border)", background: "var(--bg-card)", color: "var(--text)" }}
            >
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            {errors.industry && <p className="text-xs text-red-500 mt-1">{errors.industry.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text)" }}>Company Size</label>
            <select
              {...register("size")}
              className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text)" }}
            >
              {SIZES.map((s) => <option key={s} value={s}>{s} employees</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Founded Year" type="number" placeholder="2020" {...register("founded", { valueAsNumber: true })} />
          <Input label="Location" placeholder="Dhaka, Bangladesh" {...register("location")} />
        </div>

        <Input label="Website" placeholder="https://yourcompany.com" error={errors.website?.message} {...register("website")} />

        {/* Social links */}
        <div>
          <p className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>Social Links</p>
          <div className="space-y-3">
            <Input placeholder="LinkedIn URL" {...register("socialLinks.linkedin")} />
            <Input placeholder="Twitter URL" {...register("socialLinks.twitter")} />
            <Input placeholder="Facebook URL" {...register("socialLinks.facebook")} />
          </div>
        </div>

        <Button type="submit" loading={saving || uploading} fullWidth>
          {company ? "Save Changes" : "Create Company"}
        </Button>
      </form>
    </div>
  );
}
