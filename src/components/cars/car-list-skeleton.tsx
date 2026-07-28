export function CarListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading cars" className="animate-pulse">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="h-3 w-20 rounded bg-slate-100" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div className="grid overflow-hidden rounded-lg border border-border bg-white sm:grid-cols-[190px_1fr] lg:grid-cols-[205px_1fr]" key={index}>
            <div className="h-[190px] bg-slate-200 sm:h-[150px]" />
            <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:p-6">
              <div>
                <div className="h-5 w-52 max-w-full rounded bg-slate-200" />
                <div className="mt-3 h-5 w-28 rounded bg-blue-100" />
                <div className="mt-6 flex gap-4"><div className="h-3 w-24 rounded bg-slate-100" /><div className="h-3 w-20 rounded bg-slate-100" /></div>
              </div>
              <div className="h-10 w-full rounded-md bg-slate-100 sm:w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
