import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { FiChevronDown, FiMail, FiPhone } from "react-icons/fi";
import type { Seller } from "@/types/user";
import { StartConversationButton } from "@/components/messages/StartConversationButton";

export function SellerCard({ seller, listingId }: { seller: Seller; listingId: number }) {
  return (
    <section className="rounded-lg border border-border bg-white p-4 shadow-[0_3px_12px_rgba(15,23,42,.05)]" aria-labelledby="seller-heading">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold" id="seller-heading">Seller</h2>
        <FiChevronDown className="text-muted" aria-hidden="true" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="size-14 shrink-0 rounded-full bg-gradient-to-br from-[#0864ff] via-[#38bdf8] to-[#4f46e5] p-[3px] shadow-[0_5px_16px_rgba(8,100,255,.2)]"><div className="relative grid size-full place-items-center overflow-hidden rounded-full border border-white bg-slate-100 text-slate-500">{seller.avatarUrl ? <Image alt={`${seller.name} profile photo`} className="object-cover" fill sizes="50px" src={seller.avatarUrl} unoptimized /> : <UserRound className="size-8 stroke-[1.4]" />}</div></div>
        <div className="min-w-0"><p className="truncate text-sm font-bold">{seller.name}</p><p className="mt-0.5 truncate text-[11px] text-muted">{seller.subtitle ?? `Member since ${seller.memberSince}`}</p></div>
      </div>
      {seller.phone || seller.email ? <div className="mt-4 grid grid-cols-2 gap-2">
        {seller.phone ? <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary" href={`tel:${seller.phone}`}><FiPhone />Call</a> : null}
        {seller.email ? <a className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary" href={`mailto:${seller.email}`}><FiMail />Email</a> : null}
      </div> : null}
      <StartConversationButton listingId={listingId} receiverId={Number(seller.id)} />
      {seller.profileUrl ? <Link className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md border border-border text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary" href={seller.profileUrl}>View Seller Profile</Link> : null}
    </section>
  );
}
