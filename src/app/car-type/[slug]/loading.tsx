import { CarListSkeleton } from "@/components/cars/car-list-skeleton";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function CarTypeLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-surface-subtle py-10 sm:py-14">
        <div className="mx-auto max-w-[1120px] animate-pulse px-5 sm:px-8 lg:px-10">
          <div className="h-3 w-32 rounded bg-slate-200" />
          <div className="mt-5 rounded-xl border border-border bg-white p-5 sm:p-8">
            <div className="h-8 w-64 max-w-full rounded bg-slate-200" />
            <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-100" />
            <div className="my-7 h-px bg-border" />
            <CarListSkeleton rows={6} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
