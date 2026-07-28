"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { publicNavigation } from "@/config/navigation";
import { Logo } from "@/components/shared/logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "anonymous">("loading");

  useEffect(() => {
    const controller = new AbortController();
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin", signal: controller.signal });
        setAuthState(response.ok ? "authenticated" : "anonymous");
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setAuthState("anonymous");
      }
    }
    void checkSession();
    return () => controller.abort();
  }, []);

  return (
    <header className="relative z-50 bg-navy text-white">
      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Logo inverted />
        <nav className="hidden items-center gap-8 text-[13px] font-medium lg:flex" aria-label="Primary navigation">
          {publicNavigation.map((item) => (
            <Link className="transition-colors hover:text-blue-400" href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 text-[13px] font-medium lg:flex">
          <AccountActions authState={authState} />
        </div>
        <button
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid size-10 place-items-center rounded-md border border-white/15 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>
      {open ? (
        <div className="absolute inset-x-0 top-[70px] border-t border-white/10 bg-navy px-5 py-5 shadow-2xl lg:hidden">
          <nav className="mx-auto flex max-w-[1240px] flex-col" aria-label="Mobile navigation">
            {publicNavigation.map((item) => (
              <Link className="border-b border-white/10 py-3 text-sm" href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
            ))}
            <div className={`mt-5 grid gap-3 ${authState === "authenticated" ? "grid-cols-1" : "grid-cols-2"}`}>
              <AccountActions authState={authState} mobile onNavigate={() => setOpen(false)} />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function AccountActions({ authState, mobile = false, onNavigate }: { authState: "loading" | "authenticated" | "anonymous"; mobile?: boolean; onNavigate?: () => void }) {
  if (authState === "loading") return <span aria-label="Checking account" className={`${mobile ? "col-span-2 h-10" : "h-8 w-28"} animate-pulse rounded-md bg-white/10`} />;
  if (authState === "authenticated") return <Link className="rounded-md bg-primary px-4 py-2 text-center transition-colors hover:bg-primary-hover" href="/dashboard" onClick={onNavigate}>Dashboard</Link>;
  return <><Link className={`${mobile ? "rounded-md border border-white/20 px-4 py-2.5 text-center text-sm" : "transition-colors hover:text-blue-400"}`} href="/login" onClick={onNavigate}>Log In</Link><Link className={`rounded-md bg-primary px-4 text-center transition-colors hover:bg-primary-hover ${mobile ? "py-2.5 text-sm" : "py-2"}`} href="/register" onClick={onNavigate}>Sign Up</Link></>;
}
