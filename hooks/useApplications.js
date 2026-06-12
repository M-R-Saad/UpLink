"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useApplications(status = "all") {
  const { data, isLoading, error } = useQuery({
    queryKey: ["applications", status],
    queryFn: () =>
      fetch(`/api/applications?status=${status}&limit=50`)
        .then((r) => r.json())
        .then((j) => (j.success ? j : { data: [], statusCounts: {}, pagination: {} })),
  });

  return {
    applications: data?.data || [],
    statusCounts: data?.statusCounts || {},
    pagination: data?.pagination || {},
    isLoading,
    error,
  };
}

export function useApply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, resumeURL, coverLetter }) =>
      fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeURL, coverLetter }),
      }).then((r) => r.json()),
    onSuccess: (json) => {
      if (json.success) {
        toast.success("Application submitted!");
        queryClient.invalidateQueries({ queryKey: ["applications"] });
      } else {
        toast.error(json.message || "Failed to apply");
      }
    },
    onError: () => toast.error("Failed to submit application"),
  });
}
