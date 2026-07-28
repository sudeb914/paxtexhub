import Link from "next/link";
import { PiCarProfile } from "react-icons/pi";

export function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-blue-50 text-3xl text-primary"><PiCarProfile /></div>
      <h2 className="mt-5 text-xl font-bold">No cars found</h2>
      <p className="mt-2 text-sm text-muted">Try changing or clearing your current filters.</p>
      <Link className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white" href="/cars">Clear Filters</Link>
    </div>
  );
}
