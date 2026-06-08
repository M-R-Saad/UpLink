"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function ApplyButton({ jobId }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (!session) { router.push("/login"); return; }
    if (session.user.role !== "jobseeker") return;
    // Apply modal will be implemented in Phase 7
    router.push(`/dashboard/applications?apply=${jobId}`);
  };

  if (session?.user?.role === "employer") return null;

  return (
    <Button fullWidth onClick={handleClick}>
      {session ? "Apply Now" : "Sign in to Apply"}
    </Button>
  );
}
