"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

export function PasswordInput({ label = "Password", name = "password", autoComplete = "current-password", minLength = 8, disabled = false, error, value, onChange }: { label?: string; name?: string; autoComplete?: string; minLength?: number; disabled?: boolean; error?: string; value?: string; onChange?: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block text-sm font-semibold">{label}
      <span className="relative mt-2 block">
        <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input aria-invalid={Boolean(error)} autoComplete={autoComplete} className={`h-11 w-full rounded-md border bg-white pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 ${error ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-border focus:border-primary focus:ring-primary/15"}`} disabled={disabled} minLength={minLength} name={name} onChange={onChange ? (event) => onChange(event.target.value) : undefined} onInput={(event) => event.currentTarget.setCustomValidity("")} placeholder="Enter your password" required type={visible ? "text" : "password"} value={value} />
        <button aria-label={visible ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded text-muted transition hover:bg-slate-100 hover:text-foreground disabled:opacity-50" disabled={disabled} onClick={() => setVisible((value) => !value)} type="button">{visible ? <FiEyeOff /> : <FiEye />}</button>
      </span>
      {error ? <span className="mt-1.5 block text-xs font-normal text-red-600">{error}</span> : null}
    </label>
  );
}
