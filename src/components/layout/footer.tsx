import Link from "next/link";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Find the right car from trusted sellers, or list your own in minutes.</p>
          <div className="mt-5 flex gap-3">
            {[FiFacebook, FiInstagram, FiTwitter, FiLinkedin].map((Icon, index) => (
              <a aria-label={["Facebook", "Instagram", "Twitter", "LinkedIn"][index]} className="grid size-9 place-items-center rounded-md border border-white/10 transition-colors hover:border-primary hover:text-white" href="#" key={index}><Icon /></a>
            ))}
          </div>
        </div>
        <FooterLinks title="Marketplace" links={[["Browse Cars", "/cars"], ["Sell Your Car", "/dashboard/listings/new"], ["How It Works", "/#how-it-works"]]} />
        <FooterLinks title="Company" links={[["About Us", "/about"], ["Contact", "/contact"], ["Seller Dashboard", "/dashboard"]]} />
        <div>
          <h2 className="font-semibold text-white">Get in touch</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">support@autohub.com<br />+1 (800) 555-0148<br />New York, NY</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-slate-500">© 2026 AutoHub. All rights reserved.</div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: readonly (readonly [string, string])[] }) {
  return (
    <div>
      <h2 className="font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-slate-400">
        {links.map(([label, href]) => <li key={href}><Link className="transition-colors hover:text-white" href={href}>{label}</Link></li>)}
      </ul>
    </div>
  );
}
