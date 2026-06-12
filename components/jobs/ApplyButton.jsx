"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import ApplyModal from "./ApplyModal";

export default function ApplyButton({ jobId, jobTitle }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user.role !== "jobseeker") return;
    setShowModal(true);
  };

  if (session?.user?.role === "employer") return null;

  return (
    <>
      <Button fullWidth onClick={handleClick}>
        {session ? "Apply Now" : "Sign in to Apply"}
      </Button>
      {showModal && (
        <ApplyModal
          open={showModal}
          onClose={() => setShowModal(false)}
          jobId={jobId}
          jobTitle={jobTitle}
        />
      )}
    </>
  );
}
