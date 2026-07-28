"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiMail } from "react-icons/fi";
import { PasswordInput } from "@/components/auth/password-input";

export function LoginForm({ registrationSuccess = false }: { registrationSuccess?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) {
        setError(data.error || "Login failed. Please check your details and try again.");
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {registrationSuccess ? <div aria-live="polite" className="flex items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-800" role="status"><FiCheckCircle className="mt-0.5 shrink-0 text-base" aria-hidden="true" /><span>Your seller account has been created. Please log in.</span></div> : null}
      {error ? <div aria-live="polite" className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700" role="alert"><FiAlertCircle className="mt-0.5 shrink-0 text-base" aria-hidden="true" /><span>{error}</span></div> : null}
      <label className="block text-sm font-semibold">Email or username
        <span className="relative mt-2 block"><FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input autoComplete="username" className="h-11 w-full rounded-md border border-border pl-10 pr-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15" disabled={isSubmitting} name="username" placeholder="Email or username" required type="text" /></span>
      </label>
      <PasswordInput minLength={1} />
      <div className="flex items-center justify-between gap-4 text-sm"><label className="flex items-center gap-2 text-muted"><input className="accent-primary" name="remember" type="checkbox" />Remember me</label><Link className="font-semibold text-primary hover:underline" href="/forgot-password">Forgot password?</Link></div>
      <button className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65" disabled={isSubmitting} type="submit">{isSubmitting ? "Logging in..." : "Log In"}</button>
      <p className="text-center text-sm text-muted">New to AutoHub? <Link className="font-semibold text-primary hover:underline" href="/register">Create an account</Link></p>
    </form>
  );
}
