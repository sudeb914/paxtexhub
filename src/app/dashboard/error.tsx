"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Dashboard failed to load", error); }, [error]);
  return (
    <main className="grid min-h-screen place-items-center bg-surface-subtle px-6">
      <div className="max-w-md text-center"><FiAlertCircle className="mx-auto text-4xl text-red-500" /><p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Seller Dashboard</p><h1 className="mt-3 text-3xl font-bold">We couldn&apos;t load the dashboard</h1><p className="mt-3 text-sm leading-6 text-muted">Please try again. If the problem continues, return to the marketplace.</p><div className="mt-6 flex justify-center gap-3"><button className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white" onClick={reset} type="button">Try Again</button><Link className="rounded-md border border-border bg-white px-5 py-2.5 text-sm font-semibold" href="/">Go Home</Link></div></div>
    </main>
  );
}
