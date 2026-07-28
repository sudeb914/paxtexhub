import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ProfileCompletion } from "@/lib/profile-completion";

export function ProfileCompletionAlert({ completion, compact = false }: { completion: ProfileCompletion; compact?: boolean }) {
  const complete = completion.isComplete;
  return (
    <section className={`rounded-[16px] border p-5 ${complete ? "border-emerald-200 bg-emerald-50" : "border-blue-200 bg-blue-50"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className={`grid size-11 shrink-0 place-items-center rounded-full ${complete ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-[#0864ff]"}`}>
          {complete ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold text-[#0b1426]">{complete ? "Your profile is complete" : "Complete your seller profile"}</h2>
            <span className={`text-sm font-bold ${complete ? "text-emerald-700" : "text-[#0864ff]"}`}>{completion.percentage}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/90" aria-label={`Profile ${completion.percentage}% complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion.percentage}>
            <div className={`h-full rounded-full transition-[width] duration-500 ${complete ? "bg-emerald-500" : "bg-[#0864ff]"}`} style={{ width: `${completion.percentage}%` }} />
          </div>
          {!complete ? <p className="mt-2 text-sm leading-6 text-[#52627a]">Complete your profile before adding a listing. Missing: {completion.missingFields.join(", ")}.</p> : !compact ? <p className="mt-2 text-sm text-emerald-800">You can now add and manage vehicle listings.</p> : null}
        </div>
        {!complete ? <Link className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#0864ff] px-5 text-sm font-semibold text-white transition hover:bg-[#0757dc]" href="/dashboard/profile">Complete Profile</Link> : null}
      </div>
    </section>
  );
}
