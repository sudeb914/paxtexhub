import Link from "next/link";

export function SellerCta() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-7 text-white shadow-lg shadow-blue-900/10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="text-xl font-bold">Want to sell your car?</h2>
            <p className="mt-1 text-sm text-blue-100">Join thousands of sellers and reach potential buyers.</p>
          </div>
          <Link className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-white px-7 text-sm font-semibold text-slate-900 transition hover:bg-blue-50" href="/dashboard/listings/new">Get Started</Link>
        </div>
      </div>
    </section>
  );
}
