"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

type FieldName = "currentPassword" | "newPassword" | "confirmPassword";

export function SettingsPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldName, string>>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [visible, setVisible] = useState<Record<FieldName, boolean>>({ currentPassword: false, newPassword: false, confirmPassword: false });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(""); setFieldErrors({}); setSuccess(false);
    if (values.newPassword !== values.confirmPassword) { setFieldErrors({ confirmPassword: "Passwords do not match." }); return; }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const body = await response.json().catch(() => ({})) as { success?: boolean; error?: string; fieldErrors?: Partial<Record<FieldName, string>> };
      if (response.status === 401) { router.replace("/login"); router.refresh(); return; }
      if (!response.ok || !body.success) { setError(body.error || "Unable to change your password."); setFieldErrors(body.fieldErrors ?? {}); return; }
      setSuccess(true); setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      window.setTimeout(() => { router.replace("/login?passwordChanged=1"); router.refresh(); }, 1400);
    } catch { setError("Unable to connect. Please check your connection and try again."); }
    finally { setIsSubmitting(false); }
  }

  return <section>
    <h1 className="text-[30px] font-bold tracking-[-0.035em] text-[#0b1426] sm:text-[34px]">Settings</h1>
    <p className="mt-2 text-[15px] text-[#627189] sm:text-base">Manage your account security and password.</p>
    <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form className="rounded-[18px] border border-[#e5e9ef] bg-white p-6 shadow-[0_5px_18px_rgba(20,31,50,.055)] sm:p-8" onSubmit={submit}>
        <div className="flex items-center gap-4"><div className="grid size-12 place-items-center rounded-xl bg-blue-50 text-[#0864ff]"><KeyRound className="size-6" /></div><div><h2 className="text-xl font-bold text-[#0b1426]">Change Password</h2><p className="mt-1 text-sm text-[#627189]">Use a strong password you don&apos;t use elsewhere.</p></div></div>
        <div className="mt-8 max-w-2xl space-y-5">
          <PasswordField autoComplete="current-password" error={fieldErrors.currentPassword} label="Current Password" name="currentPassword" onChange={(value) => setValues((current) => ({ ...current, currentPassword: value }))} onToggle={() => setVisible((current) => ({ ...current, currentPassword: !current.currentPassword }))} value={values.currentPassword} visible={visible.currentPassword} />
          <div className="grid gap-5 sm:grid-cols-2"><PasswordField autoComplete="new-password" error={fieldErrors.newPassword} label="New Password" name="newPassword" onChange={(value) => setValues((current) => ({ ...current, newPassword: value }))} onToggle={() => setVisible((current) => ({ ...current, newPassword: !current.newPassword }))} value={values.newPassword} visible={visible.newPassword} /><PasswordField autoComplete="new-password" error={fieldErrors.confirmPassword} label="Confirm New Password" name="confirmPassword" onChange={(value) => setValues((current) => ({ ...current, confirmPassword: value }))} onToggle={() => setVisible((current) => ({ ...current, confirmPassword: !current.confirmPassword }))} value={values.confirmPassword} visible={visible.confirmPassword} /></div>
        </div>
        {error ? <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p> : null}
        {success ? <p className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700" role="status"><CheckCircle2 className="size-5" />Password changed. Redirecting you to sign in...</p> : null}
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#edf0f4] pt-6 sm:flex-row sm:justify-end"><button className="h-11 rounded-lg border border-[#dfe4eb] px-5 text-sm font-semibold text-[#33445c] transition hover:bg-slate-50 disabled:opacity-50" disabled={isSubmitting} onClick={() => { setValues({ currentPassword: "", newPassword: "", confirmPassword: "" }); setFieldErrors({}); setError(""); }} type="button">Cancel</button><button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0864ff] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0757dc] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit"><ShieldCheck className="size-5" />{isSubmitting ? "Updating Password..." : "Update Password"}</button></div>
      </form>
      <aside className="rounded-[18px] border border-[#e5e9ef] bg-white p-6 shadow-[0_5px_18px_rgba(20,31,50,.055)]"><div className="grid size-11 place-items-center rounded-xl bg-[#f2f6ff] text-[#0864ff]"><LockKeyhole className="size-5" /></div><h2 className="mt-5 text-lg font-bold text-[#0b1426]">Password requirements</h2><ul className="mt-4 space-y-3 text-sm leading-5 text-[#627189]"><li>At least 8 characters</li><li>One uppercase letter</li><li>One lowercase letter</li><li>At least one number</li></ul><p className="mt-5 border-t border-[#edf0f4] pt-5 text-xs leading-5 text-[#8290a3]">After changing your password, you&apos;ll be securely signed out and asked to log in again.</p></aside>
    </div>
  </section>;
}

function PasswordField({ autoComplete, error, label, name, onChange, onToggle, value, visible }: { autoComplete: string; error?: string; label: string; name: FieldName; onChange: (value: string) => void; onToggle: () => void; value: string; visible: boolean }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-[#26364d]">{label}</span><span className="relative block"><input aria-invalid={Boolean(error)} autoComplete={autoComplete} className={`h-12 w-full rounded-lg border bg-white px-4 pr-12 text-sm text-[#172236] outline-none transition placeholder:text-[#9aa5b5] focus:ring-2 ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-[#dfe4eb] focus:border-[#0864ff] focus:ring-blue-100"}`} maxLength={256} minLength={name === "currentPassword" ? 1 : 8} name={name} onChange={(event) => onChange(event.target.value)} placeholder={`Enter ${label.toLowerCase()}`} required type={visible ? "text" : "password"} value={value} /><button aria-label={visible ? `Hide ${label}` : `Show ${label}`} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-[#718096] transition hover:bg-slate-100" onClick={onToggle} type="button">{visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></span>{error ? <span className="mt-1.5 block text-xs text-red-600">{error}</span> : null}</label>;
}
