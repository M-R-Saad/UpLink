"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const ALERTS_KEY = ["alerts"];

export function useAlerts() {
  return useQuery({
    queryKey: ALERTS_KEY,
    queryFn: () => fetch("/api/alerts").then((r) => r.json()).then((j) => j.data || []),
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (json) => {
      if (json.success) {
        toast.success("Alert created!");
        qc.invalidateQueries({ queryKey: ALERTS_KEY });
      } else {
        toast.error(json.message);
      }
    },
    onError: () => toast.error("Failed to create alert"),
  });
}

export function useUpdateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) =>
      fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (json) => {
      if (json.success) {
        toast.success("Alert updated!");
        qc.invalidateQueries({ queryKey: ALERTS_KEY });
      } else {
        toast.error(json.message);
      }
    },
    onError: () => toast.error("Failed to update alert"),
  });
}

export function useToggleAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) =>
      fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      }).then((r) => r.json()),
    onSuccess: (json) => {
      if (json.success) {
        qc.invalidateQueries({ queryKey: ALERTS_KEY });
      } else {
        toast.error(json.message);
      }
    },
    onError: () => toast.error("Failed to toggle alert"),
  });
}

export function useDeleteAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      fetch(`/api/alerts/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: (json) => {
      if (json.success) {
        toast.success("Alert deleted");
        qc.invalidateQueries({ queryKey: ALERTS_KEY });
      } else {
        toast.error(json.message);
      }
    },
    onError: () => toast.error("Failed to delete alert"),
  });
}
