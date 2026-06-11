"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn:  () => fetch("/api/profile").then((r) => r.json()).then((j) => j.data),
  });

  const { mutateAsync: updateProfile, isPending: updating } = useMutation({
    mutationFn: (data) =>
      fetch("/api/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (json) => {
      if (json.success) {
        toast.success("Profile updated");
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      } else {
        toast.error(json.message);
      }
    },
    onError: () => toast.error("Failed to update profile"),
  });

  return { profile, isLoading, updateProfile, updating };
}
