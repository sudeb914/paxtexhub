import Link from "next/link";
import { CarFront, Plus } from "lucide-react";

export function EmptyListingsState() {
  return (
    <div className="flex min-h-[430px] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid size-24 place-items-center rounded-full bg-blue-50 text-[#0864ff]"><CarFront className="size-11 stroke-[1.6]" aria-hidden="true" /></div>
      <h2 className="mt-6 text-xl font-bold tracking-[-0.02em] text-[#0b1426]">You haven&apos;t added any listings yet.</h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-[#627189]">Add your first vehicle to start reaching buyers on the AutoHub marketplace.</p>
      <Link className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-[#0864ff] px-5 text-sm font-semibold text-white transition hover:bg-[#0757dc]" href="/dashboard/add-listing"><Plus className="size-5" />Add Your First Car</Link>
    </div>
  );
}
