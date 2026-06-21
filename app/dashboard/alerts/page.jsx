"use client";
import { useState, useEffect } from "react";
import { useAlerts } from "../../../hooks/useAlerts";
import AlertCard from "../../../components/dashboard/AlertCard";
import AlertForm from "../../../components/dashboard/AlertForm";
import Spinner from "../../../components/ui/Spinner";
import EmptyState from "../../../components/ui/EmptyState";
import Button from "../../../components/ui/Button";
import { FiBell, FiPlus } from "react-icons/fi";

export default function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts();
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories for the form
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setCategories(j.data);
      })
      .catch(() => {});
  }, []);

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingAlert(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            Job Alerts
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-sub)" }}>
            Get notified when new jobs match your preferences
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm">
          <FiPlus size={14} /> New Alert
        </Button>
      </div>

      {/* Alert List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" />
        </div>
      ) : !alerts || alerts.length === 0 ? (
        <EmptyState
          icon={FiBell}
          title="No job alerts yet"
          description="Create an alert to get notified when new jobs matching your criteria are posted"
          action={
            <Button onClick={() => setShowForm(true)}>
              <FiPlus size={14} /> Create Your First Alert
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <AlertCard key={alert._id} alert={alert} onEdit={handleEdit} />
            ))}
          </div>

          {/* Alert count */}
          <p className="text-xs text-center pt-2" style={{ color: "var(--text-mute)" }}>
            {alerts.length} of 10 alerts used
          </p>
        </>
      )}

      {/* Create / Edit Modal */}
      <AlertForm
        open={showForm}
        onClose={handleClose}
        editAlert={editingAlert}
        categories={categories}
      />
    </div>
  );
}
