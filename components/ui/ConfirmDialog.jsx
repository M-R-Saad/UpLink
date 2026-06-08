"use client";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", message, confirmLabel = "Confirm", loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {message && <p className="text-sm mb-5" style={{ color: "var(--text-sub)" }}>{message}</p>}
      <div className="flex gap-2">
        <Button variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
        <Button variant="danger" fullWidth onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
