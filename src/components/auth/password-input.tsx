"use client";

import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

export function PasswordInput({ label = "Password", name = "password", autoComplete = "current-password", minLength = 8 }: { label?: string; name?: string; autoComplete?: string; minLength?: number }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block text-sm font-semibold">{label}
      <span className="relative mt-2 block">
        <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input autoComplete={autoComplete} className="h-11 w-full rounded-md border border-border bg-white pl-10 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15" minLength={minLength} name={name} onInput={(event) => event.currentTarget.setCustomValidity("")} placeholder="Enter your password" required type={visible ? "text" : "password"} />
        <button aria-label={visible ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded text-muted transition hover:bg-slate-100 hover:text-foreground" onClick={() => setVisible((value) => !value)} type="button">{visible ? <FiEyeOff /> : <FiEye />}</button>
      </span>
    </label>
  );
}
