import type { Metadata } from "next";
import Link from "next/link";
import { FiCheckCircle, FiSearch, FiShield, FiUsers } from "react-icons/fi";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "About AutoHub",
  description: "Learn how AutoHub helps buyers find the right car and gives trusted sellers a simpler way to reach them.",
};

const values = [
  { icon: FiShield, title: "Trust comes first", text: "We’re building a marketplace where clear vehicle information and seller transparency make every search more confident." },
  { icon: FiSearch, title: "Simple car discovery", text: "Useful filters, clear listings, and focused details help buyers compare vehicles without unnecessary friction." },
  { icon: FiUsers, title: "Built for both sides", text: "Buyers get a better search experience while sellers get practical tools to publish and manage their listings." },
];

const steps = ["Browse cars by type, brand, or location", "Review vehicle details and seller information", "Contact the seller and arrange your next step"];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-navy py-20 text-white sm:py-24">
          <div className="absolute -right-32 -top-40 size-[420px] rounded-full bg-primary/20 blur-3xl" />
          <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">About AutoHub</p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl lg:text-6xl">A better way to find your next car</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">AutoHub connects car buyers with trusted sellers through a clean, straightforward marketplace designed to make every step easier.</p>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1120px] gap-10 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16 lg:px-10">
            <div>
              <p className="text-sm font-semibold text-primary">Our purpose</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Making the car marketplace feel simple and dependable</h2>
            </div>
            <div className="space-y-5 text-sm leading-7 text-muted sm:text-base">
              <p>Finding a car can feel complicated. AutoHub brings listings, useful vehicle information, and seller contact options into one focused experience.</p>
              <p>Whether you are buying your first car, upgrading your family vehicle, or selling a car you already own, our goal is to help you move forward with clarity and confidence.</p>
            </div>
          </div>
        </section>

        <section className="bg-surface-subtle py-16 sm:py-20">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary">What we value</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em]">Designed around confident decisions</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {values.map(({ icon: Icon, title, text }) => (
                <article className="rounded-xl border border-border bg-white p-7 shadow-[0_5px_20px_rgba(15,23,42,.05)]" key={title}>
                  <div className="grid size-12 place-items-center rounded-lg bg-blue-50 text-xl text-primary"><Icon aria-hidden="true" /></div>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[900px] px-5 sm:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold text-primary">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em]">From search to conversation</h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div className="rounded-lg border border-border p-6 text-center" key={step}>
                  <span className="mx-auto grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</span>
                  <p className="mt-4 text-sm font-semibold leading-6">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-7 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 px-7 py-10 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <div><div className="flex items-center gap-2 text-blue-100"><FiCheckCircle /><span className="text-sm font-semibold">Ready when you are</span></div><h2 className="mt-2 text-2xl font-bold">Find the car that fits your life.</h2></div>
              <div className="flex flex-wrap gap-3"><Link className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-blue-50" href="/cars">Browse Cars</Link><Link className="rounded-md border border-white/35 px-5 py-3 text-sm font-semibold transition hover:bg-white/10" href="/contact">Contact Us</Link></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
