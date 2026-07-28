import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function CarDetailsLoading() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-surface-subtle py-10 sm:py-14">
        <div className="mx-auto max-w-[1120px] animate-pulse px-5 sm:px-8 lg:px-10">
          <div className="h-3 w-52 rounded bg-slate-200" />
          <div className="mt-5 grid gap-8 rounded-xl border border-border bg-white p-5 sm:p-8 lg:grid-cols-[1.42fr_.9fr]">
            <div><div className="aspect-[1.43] rounded-lg bg-slate-200" /><div className="mt-3 grid grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, index) => <div className="aspect-[1.55] rounded bg-slate-100" key={index} />)}</div></div>
            <div><div className="h-6 w-48 rounded bg-slate-200" /><div className="mt-3 h-7 w-28 rounded bg-blue-100" /><div className="my-6 h-px bg-border" /><div className="grid grid-cols-2 gap-5">{Array.from({ length: 6 }).map((_, index) => <div className="h-9 rounded bg-slate-100" key={index} />)}</div><div className="mt-6 h-28 rounded-lg bg-slate-100" /></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
