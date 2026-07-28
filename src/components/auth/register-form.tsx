"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiCheckCircle, FiMail, FiUser } from "react-icons/fi";
import { PasswordInput } from "@/components/auth/password-input";

type FieldName = "firstName" | "lastName" | "email" | "password" | "confirmPassword" | "acceptTerms";
type Values = Record<FieldName, string | boolean>;
const fieldClass = "h-11 w-full rounded-md border border-border pl-10 pr-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-slate-50";

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", acceptTerms: false });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<Name extends FieldName>(name: Name, value: Values[Name]) {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(""); setSuccess(""); setFieldErrors({});
    if (values.password !== values.confirmPassword) { setFieldErrors({ confirmPassword: "Passwords do not match." }); return; }
    if (!values.acceptTerms) { setFieldErrors({ acceptTerms: "You must accept the Terms of Service and Privacy Policy." }); return; }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const body = await response.json().catch(() => ({})) as { success?: boolean; message?: string; error?: string; fieldErrors?: Partial<Record<FieldName, string>> };
      if (!response.ok || !body.success) { setError(body.error || "Unable to create your seller account."); setFieldErrors(body.fieldErrors ?? {}); return; }
      setSuccess(body.message || "Your seller account has been created. You can now log in.");
      window.setTimeout(() => { router.replace("/login?registered=1"); router.refresh(); }, 1000);
    } catch { setError("Unable to connect. Check your internet connection and try again."); }
    finally { setIsSubmitting(false); }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {error ? <div aria-live="polite" className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700" role="alert"><FiAlertCircle className="mt-0.5 shrink-0 text-base" /><span>{error}</span></div> : null}
      {success ? <div aria-live="polite" className="flex items-start gap-2.5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-800" role="status"><FiCheckCircle className="mt-0.5 shrink-0 text-base" /><span>{success}</span></div> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">First name<span className="relative mt-2 block"><FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-invalid={Boolean(fieldErrors.firstName)} autoComplete="given-name" className={`${fieldClass} ${fieldErrors.firstName ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`} disabled={isSubmitting} name="firstName" onChange={(event) => update("firstName", event.target.value)} placeholder="First name" required value={String(values.firstName)} /></span>{fieldErrors.firstName ? <span className="mt-1.5 block text-xs font-normal text-red-600">{fieldErrors.firstName}</span> : null}</label>
        <label className="block text-sm font-semibold">Last name<span className="relative mt-2 block"><FiUser className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-invalid={Boolean(fieldErrors.lastName)} autoComplete="family-name" className={`${fieldClass} ${fieldErrors.lastName ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`} disabled={isSubmitting} name="lastName" onChange={(event) => update("lastName", event.target.value)} placeholder="Last name" required value={String(values.lastName)} /></span>{fieldErrors.lastName ? <span className="mt-1.5 block text-xs font-normal text-red-600">{fieldErrors.lastName}</span> : null}</label>
      </div>
      <label className="block text-sm font-semibold">Email address<span className="relative mt-2 block"><FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-invalid={Boolean(fieldErrors.email)} autoComplete="email" className={`${fieldClass} ${fieldErrors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`} disabled={isSubmitting} name="email" onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" required type="email" value={String(values.email)} /></span>{fieldErrors.email ? <span className="mt-1.5 block text-xs font-normal text-red-600">{fieldErrors.email}</span> : null}</label>
      <div className="grid gap-5 sm:grid-cols-2"><PasswordInput autoComplete="new-password" disabled={isSubmitting} error={fieldErrors.password} onChange={(value) => update("password", value)} value={String(values.password)} /><PasswordInput autoComplete="new-password" disabled={isSubmitting} error={fieldErrors.confirmPassword} label="Confirm password" name="confirmPassword" onChange={(value) => update("confirmPassword", value)} value={String(values.confirmPassword)} /></div>
      <p className="-mt-2 text-xs text-muted">Use at least 8 characters, including a letter and a number.</p>
      <label className="flex items-start gap-3 text-xs leading-5 text-muted"><input checked={Boolean(values.acceptTerms)} className="mt-1 accent-primary" disabled={isSubmitting} name="acceptTerms" onChange={(event) => update("acceptTerms", event.target.checked)} required type="checkbox" /><span>I agree to AutoHub&apos;s <Link className="font-semibold text-primary hover:underline" href="#">Terms of Service</Link> and <Link className="font-semibold text-primary hover:underline" href="#">Privacy Policy</Link>.{fieldErrors.acceptTerms ? <span className="mt-1 block text-red-600">{fieldErrors.acceptTerms}</span> : null}</span></label>
      <button className="h-11 w-full rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65" disabled={isSubmitting || Boolean(success)} type="submit">{isSubmitting ? "Creating Account..." : "Create Account"}</button>
      <p className="text-center text-sm text-muted">Already have an account? <Link className="font-semibold text-primary hover:underline" href="/login">Log in</Link></p>
    </form>
  );
}
