"use client";
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { useCreateAlert, useUpdateAlert } from "../../hooks/useAlerts";
import { FiX, FiPlus } from "react-icons/fi";

const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

const LOCATION_TYPES = [
  { value: "any", label: "Any Location" },
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
];

export default function AlertForm({ open, onClose, editAlert, categories = [] }) {
  const { mutateAsync: create, isPending: creating } = useCreateAlert();
  const { mutateAsync: update, isPending: updating } = useUpdateAlert();
  const isEditing = !!editAlert;

  const [label, setLabel] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [locationType, setLocationType] = useState("any");
  const [frequency, setFrequency] = useState("instant");

  // Populate form when editing
  useEffect(() => {
    if (editAlert) {
      setLabel(editAlert.label || "");
      setKeywords(editAlert.keywords || []);
      setSelectedCategories(
        (editAlert.categories || []).map((c) => (typeof c === "object" ? c._id : c))
      );
      setJobTypes(editAlert.jobTypes || []);
      setLocationType(editAlert.locationType || "any");
      setFrequency(editAlert.frequency || "instant");
    } else {
      resetForm();
    }
  }, [editAlert, open]);

  const resetForm = () => {
    setLabel("");
    setKeywords([]);
    setKeywordInput("");
    setSelectedCategories([]);
    setJobTypes([]);
    setLocationType("any");
    setFrequency("instant");
  };

  const addKeyword = () => {
    const val = keywordInput.trim();
    if (val && !keywords.includes(val)) {
      setKeywords([...keywords, val]);
    }
    setKeywordInput("");
  };

  const removeKeyword = (kw) => setKeywords(keywords.filter((k) => k !== kw));

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleJobType = (type) => {
    setJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    const data = {
      label: label.trim(),
      keywords,
      categories: selectedCategories,
      jobTypes,
      locationType,
      frequency,
      locations: [],
    };

    let result;
    if (isEditing) {
      result = await update({ id: editAlert._id, ...data });
    } else {
      result = await create(data);
    }

    if (result?.success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Job Alert" : "Create Job Alert"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Alert Label */}
        <Input
          label="Alert Name"
          placeholder='e.g. "React Developer in Dhaka"'
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Keywords
          </label>
          <div className="flex gap-2">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyword();
                }
              }}
              placeholder="Type a keyword and press Enter..."
              className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-card)",
                color: "var(--text)",
              }}
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0"
              style={{ background: "var(--accent)" }}
            >
              <FiPlus size={14} />
            </button>
          </div>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                >
                  {kw}
                  <button type="button" onClick={() => removeKeyword(kw)} className="hover:opacity-70">
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
            Matches against job titles and skills
          </p>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Categories
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const selected = selectedCategories.includes(cat._id);
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => toggleCategory(cat._id)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all border"
                    style={{
                      background: selected ? "var(--accent)" : "transparent",
                      color: selected ? "#fff" : "var(--text-sub)",
                      borderColor: selected ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    {cat.icon} {cat.name}
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
              Leave empty to match all categories
            </p>
          </div>
        )}

        {/* Job Types */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Job Types
          </label>
          <div className="flex flex-wrap gap-1.5">
            {JOB_TYPES.map(({ value, label: lbl }) => {
              const selected = jobTypes.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleJobType(value)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all border"
                  style={{
                    background: selected ? "var(--accent)" : "transparent",
                    color: selected ? "#fff" : "var(--text-sub)",
                    borderColor: selected ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {lbl}
                </button>
              );
            })}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-mute)" }}>
            Leave empty to match all types
          </p>
        </div>

        {/* Location Type & Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Location Preference"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
          >
            {LOCATION_TYPES.map(({ value, label: lbl }) => (
              <option key={value} value={value}>
                {lbl}
              </option>
            ))}
          </Select>

          <Select
            label="Notification Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="instant">Instant</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Digest</option>
          </Select>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
            Cancel
          </Button>
          <Button type="submit" loading={creating || updating} className="flex-1">
            {isEditing ? "Update Alert" : "Create Alert"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
