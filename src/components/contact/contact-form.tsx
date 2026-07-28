"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

const inputClass = "mt-2 h-11 w-full rounded-md border border-border bg-white px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-10 text-center" role="status">
        <FiCheckCircle className="mx-auto text-4xl text-emerald-600" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-bold text-emerald-950">Thanks for contacting us</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-emerald-800">This demo message has been received. Connect the form to your email or WordPress service when the backend is ready.</p>
        <button className="mt-5 text-sm font-semibold text-emerald-800 underline underline-offset-4" onClick={() => setSubmitted(false)} type="button">Send another message</button>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" placeholder="Your name" />
        <Field label="Email address" name="email" placeholder="you@example.com" type="email" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone number" name="phone" placeholder="Optional" required={false} type="tel" />
        <label className="text-sm font-semibold">How can we help?
          <select className={inputClass} defaultValue="general" name="topic">
            <option value="general">General question</option><option value="buying">Buying a car</option><option value="selling">Selling a car</option><option value="listing">Listing support</option><option value="account">Account support</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-semibold">Message
        <textarea className="mt-2 min-h-36 w-full resize-y rounded-md border border-border bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15" name="message" placeholder="Tell us how we can help..." required />
      </label>
      <label className="flex items-start gap-3 text-xs leading-5 text-muted"><input className="mt-1 accent-primary" required type="checkbox" />I agree that AutoHub may use these details to respond to my inquiry.</label>
      <button className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2" type="submit">Send Message</button>
    </form>
  );
}

function Field({ label, name, placeholder, type = "text", required = true }: { label: string; name: string; placeholder: string; type?: string; required?: boolean }) {
  return <label className="text-sm font-semibold">{label}<input className={inputClass} name={name} placeholder={placeholder} required={required} type={type} /></label>;
}
