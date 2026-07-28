"use client";

import Link from "next/link";
import { useState } from "react";
import { FiCheckCircle, FiMail, FiUser } from "react-icons/fi";
import { PasswordInput } from "@/components/auth/password-input";

const fieldClass = "h-11 w-full rounded-md border border-border pl-10 pr-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function RegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-7 text-center"><FiCheckCircle className="mx-auto text-4xl text-emerald-600" /><h2 className="mt-4 font-bold text-emerald-950">Demo account created</h2><p className="mt-2 text-sm leading-6 text-emerald-800">Registration is ready to connect to your WordPress user endpoint.</p><button className="mt-4 text-sm font-semibold text-emerald-800 underline underline-offset-4" onClick={() => setSubmitted(false)} type="button">Back to form</button></div>;

  return (
    <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); if (form.get("password") !== form.get("confirmPassword")) { event.currentTarget.querySelector<HTMLInputElement>("[name=confirmPassword]")?.setCustomValidity("Passwords do not match"); event.currentTarget.reportValidity(); return; } setSubmitted(true); }}>
      <label className="block text-sm font-semibold">Full name<span className="relative mt-2 block"><FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input autoComplete="name" className={fieldClass} name="name" placeholder="Your full name" required /></span></label>
      <label className="block text-sm font-semibold">Email address<span className="relative mt-2 block"><FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input autoComplete="email" className={fieldClass} name="email" placeholder="you@example.com" required type="email" /></span></label>
      <div className="grid gap-5 sm:grid-cols-2"><PasswordInput autoComplete="new-password" /><PasswordInput autoComplete="new-password" label="Confirm password" name="confirmPassword" /></div>
      <p className="-mt-2 text-xs text-muted">Use at least 8 characters.</p>
      <label className="flex items-start gap-3 text-xs leading-5 text-muted"><input className="mt-1 accent-primary" required type="checkbox" />I agree to AutoHub&apos;s <Link className="font-semibold text-primary hover:underline" href="#">Terms of Service</Link> and <Link className="font-semibold text-primary hover:underline" href="#">Privacy Policy</Link>.</label>
      <button className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2" type="submit">Create Account</button>
      <p className="text-center text-sm text-muted">Already have an account? <Link className="font-semibold text-primary hover:underline" href="/login">Log in</Link></p>
    </form>
  );
}
