"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSavedJobs() {
  const { data, isLoading } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: () =>
      fetch("/api/saved")
        .then((r) => r.json())
        .then((j) => (j.success ? j.data : [])),
  });

  return { savedJobs: data || [], isLoading };
}

export function useSaveJob() {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: (jobId) =>
      fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
    },
    onError: () => toast.error("Failed to save job"),
  });

  const unsaveMutation = useMutation({
    mutationFn: (jobId) =>
      fetch("/api/saved", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
    },
    onError: () => toast.error("Failed to unsave job"),
  });

  return {
    saveJob: saveMutation.mutate,
    unsaveJob: unsaveMutation.mutate,
    isSaving: saveMutation.isPending || unsaveMutation.isPending,
  };
}

export function useIsSaved(jobId) {
  const { savedJobs } = useSavedJobs();
  return savedJobs.some((s) => s.job?._id === jobId || s.job === jobId);
}
