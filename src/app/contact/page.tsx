import type { Metadata } from "next";
import { FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { ContactForm } from "@/components/contact/contact-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Contact AutoHub",
  description: "Contact the AutoHub team for help with buying, selling, listings, or your account.",
};

const contactDetails = [
  { icon: FiMail, label: "Email", value: "support@autohub.com", href: "mailto:support@autohub.com" },
  { icon: FiPhone, label: "Phone", value: "+1 (800) 555-0148", href: "tel:+18005550148" },
  { icon: FiMapPin, label: "Office", value: "New York, NY", href: undefined },
  { icon: FiClock, label: "Support hours", value: "Mon–Fri, 9:00 AM–6:00 PM", href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-surface-subtle">
        <section className="bg-navy py-16 text-white sm:py-20">
          <div className="mx-auto max-w-[800px] px-5 text-center sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Contact AutoHub</p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">How can we help?</h1>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">Questions about a listing, selling your car, or your account? Send us a message and our team will point you in the right direction.</p>
          </div>
        </section>

        <section className="py-14 sm:py-18">
          <div className="mx-auto grid max-w-[1120px] gap-8 px-5 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-10">
            <aside>
              <h2 className="text-2xl font-bold tracking-[-0.03em]">Get in touch</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Choose the option that works best for you. We normally reply within one business day.</p>
              <div className="mt-7 space-y-3">
                {contactDetails.map(({ icon: Icon, label, value, href }) => {
                  const content = <><div className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-primary"><Icon aria-hidden="true" /></div><div><p className="text-xs font-medium text-muted">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div></>;
                  return href ? <a className="flex items-center gap-4 rounded-lg border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-sm" href={href} key={label}>{content}</a> : <div className="flex items-center gap-4 rounded-lg border border-border bg-white p-4" key={label}>{content}</div>;
                })}
              </div>
              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">
                <h3 className="text-sm font-bold text-blue-950">Looking for a specific car?</h3>
                <p className="mt-2 text-sm leading-6 text-blue-900/70">Include the listing title or URL in your message so we can help faster.</p>
              </div>
            </aside>
            <div className="rounded-xl border border-border bg-white p-6 shadow-[0_8px_28px_rgba(15,23,42,.06)] sm:p-8">
              <h2 className="text-2xl font-bold tracking-[-0.03em]">Send us a message</h2>
              <p className="mt-2 text-sm text-muted">Fill in the form below and we’ll get back to you soon.</p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
