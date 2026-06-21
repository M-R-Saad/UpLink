"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import CategoryForm from "../../../components/admin/CategoryForm";
import CategoryIcon from "../../../components/ui/CategoryIcon";
import Spinner from "../../../components/ui/Spinner";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () =>
      fetch("/api/categories")
        .then((r) => r.json())
        .then((j) => j.data || []),
  });

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Category deleted");
        qc.invalidateQueries({ queryKey: ["admin-categories"] });
      } else {
        toast.error(json.message);
      }
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const categories = data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Categories</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
            Manage job categories
          </p>
        </div>
        <button
          onClick={() => { setEditCategory(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition"
          style={{ background: "var(--accent)" }}
        >
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="p-4 rounded-2xl border transition hover:shadow-sm"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                  <CategoryIcon icon={cat.icon} size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{cat.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-mute)" }}>
                    {cat.jobCount} {cat.jobCount === 1 ? "job" : "jobs"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditCategory(cat); setShowForm(true); }}
                  className="p-1.5 rounded-lg transition hover:bg-[var(--bg-muted)]"
                  style={{ color: "var(--text-sub)" }}
                >
                  <FiEdit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  disabled={deleting === cat._id}
                  className="p-1.5 rounded-lg transition hover:bg-red-50"
                  style={{ color: "#ef4444" }}
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
            {cat.description && (
              <p className="text-xs mt-2 truncate" style={{ color: "var(--text-sub)" }}>
                {cat.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: "var(--text-mute)" }}>No categories yet. Add one to get started.</p>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <CategoryForm
          category={editCategory}
          onClose={() => setShowForm(false)}
          onSave={() => qc.invalidateQueries({ queryKey: ["admin-categories"] })}
        />
      )}
    </div>
  );
}
