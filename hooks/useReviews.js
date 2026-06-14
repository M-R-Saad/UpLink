"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useReviews(companyId, page = 1) {
  return useQuery({
    queryKey: ["reviews", companyId, page],
    queryFn: () =>
      fetch(`/api/companies/${companyId}/reviews?page=${page}&limit=10`)
        .then((r) => r.json())
        .then((j) => ({
          reviews: j.data || [],
          pagination: j.pagination || { total: 0, page: 1, pages: 1 },
        })),
    enabled: !!companyId,
  });
}

export function useCreateReview(companyId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetch(`/api/companies/${companyId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (json) => {
      if (json.success) {
        toast.success("Review submitted!");
        qc.invalidateQueries({ queryKey: ["reviews", companyId] });
      } else {
        toast.error(json.message);
      }
    },
    onError: () => toast.error("Failed to submit review"),
  });
}
