import Link from "next/link";
import { FiCheck, FiShield } from "react-icons/fi";
import { Logo } from "@/components/shared/logo";

const benefits = ["Create and manage car listings", "Connect directly with interested buyers", "Keep your profile and inquiries in one place"];

export function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[.92fr_1.08fr]">
      <section className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col xl:p-16">
        <div className="absolute -left-32 bottom-10 size-[420px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 top-0 size-[320px] rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="relative"><Logo inverted /></div>
        <div className="relative my-auto max-w-lg py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Your trusted car marketplace</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-[-0.04em] xl:text-5xl">Buy smarter.<br /><span className="text-blue-400">Sell with confidence.</span></h2>
          <p className="mt-6 max-w-md leading-7 text-slate-300">Everything you need to discover the right vehicle or reach serious buyers, all in one simple marketplace.</p>
          <ul className="mt-9 space-y-4">
            {benefits.map((benefit) => <li className="flex items-center gap-3 text-sm text-slate-200" key={benefit}><span className="grid size-6 place-items-center rounded-full bg-blue-500/20 text-blue-300"><FiCheck aria-hidden="true" /></span>{benefit}</li>)}
          </ul>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-slate-400"><FiShield aria-hidden="true" />Your information is protected and never sold.</div>
      </section>

      <section className="flex min-h-screen flex-col">
        <header className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="lg:hidden"><Logo /></div>
          <Link className="ml-auto text-sm font-semibold text-muted transition hover:text-primary" href="/">Back to marketplace</Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-6 sm:px-8 lg:px-12">
          <div className="w-full max-w-[480px]">
            <p className="text-sm font-semibold text-primary">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-base">{description}</p>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
