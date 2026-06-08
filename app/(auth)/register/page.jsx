"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FiBriefcase, FiUser } from "react-icons/fi";
import { registerSchema } from "../../../schemas/authSchemas";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("jobseeker");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "jobseeker" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role }),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.message); return; }

      // Auto sign in after register
      const result = await signIn("credentials", {
        email: data.email, password: data.password, redirect: false,
      });

      if (result?.error) { toast.error("Login failed after register"); return; }

      toast.success("Welcome to UpLink!");
      router.push(role === "employer" ? "/employer/dashboard" : "/dashboard");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", {
      callbackUrl: role === "employer" ? "/employer/dashboard" : "/dashboard",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Create account</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
          Sign in
        </Link>
      </p>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {[
          { value: "jobseeker", label: "Job Seeker",  icon: FiUser,      desc: "Find jobs" },
          { value: "employer",  label: "Employer",    icon: FiBriefcase, desc: "Post jobs" },
        ].map(({ value, label, icon: Icon, desc }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className="flex flex-col items-center gap-1 p-4 rounded-xl border text-center transition"
            style={{
              borderColor: role === value ? "var(--accent)" : "var(--border)",
              background:  role === value ? "var(--accent-soft)" : "var(--bg-muted)",
              color:       role === value ? "var(--accent)" : "var(--text-sub)",
            }}
          >
            <Icon size={20} />
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs">{desc}</span>
          </button>
        ))}
      </div>

      {/* Google */}
      <Button
        variant="outline"
        fullWidth
        onClick={handleGoogle}
        loading={googleLoading}
        className="mb-4"
      >
        <FcGoogle size={18} /> Continue with Google
      </Button>

      <div className="flex items-center gap-2 mb-4">
        <hr className="flex-1" style={{ borderColor: "var(--border)" }} />
        <span className="text-xs" style={{ color: "var(--text-mute)" }}>or</span>
        <hr className="flex-1" style={{ borderColor: "var(--border)" }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min 6 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" fullWidth loading={loading}>
          Create Account
        </Button>
      </form>
    </div>
  );
}
