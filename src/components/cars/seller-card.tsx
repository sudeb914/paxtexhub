import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiMail, FiPhone } from "react-icons/fi";
import type { Seller } from "@/types/user";

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <section className="rounded-lg border border-border bg-white p-4 shadow-[0_3px_12px_rgba(15,23,42,.05)]" aria-labelledby="seller-heading">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" id="seller-heading">Seller</h2>
        <FiChevronDown className="text-muted" aria-hidden="true" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Image alt={`${seller.name} profile photo`} className="size-12 rounded-full object-cover" height={48} src={seller.avatarUrl} width={48} />
        <div><p className="text-sm font-bold">{seller.name}</p><p className="mt-0.5 text-[11px] text-muted">{seller.subtitle ?? `Member since ${seller.memberSince}`}</p></div>
      </div>
      {seller.phone || seller.email ? <div className="mt-4 grid grid-cols-2 gap-2">
        {seller.phone ? <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary" href={`tel:${seller.phone}`}><FiPhone />Call</a> : null}
        {seller.email ? <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary" href={`mailto:${seller.email}`}><FiMail />Email</a> : null}
      </div> : null}
      {seller.email ? <a className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover" href={`mailto:${seller.email}?subject=AutoHub inquiry`}>Contact Seller</a> : seller.profileUrl ? <a className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover" href={seller.profileUrl}>View Seller Profile</a> : <Link className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover" href="/contact">Contact Us</Link>}
    </section>
  );
}
