"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { loginSchema } from "../../../schemas/authSchemas";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const getRedirect = (role) => {
    if (callbackUrl) return callbackUrl;
    if (role === "employer") return "/employer/dashboard";
    if (role === "admin")    return "/admin";
    return "/dashboard";
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email, password: data.password, redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      // Fetch session to get role for redirect
      const session = await fetch("/api/auth/session").then((r) => r.json());
      toast.success("Welcome back!");
      router.push(getRedirect(session?.user?.role));
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: callbackUrl || "/dashboard" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Welcome back</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-sub)" }}>
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
          Sign up
        </Link>
      </p>

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
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" fullWidth loading={loading}>
          Sign In
        </Button>
      </form>
    </div>
  );
}
