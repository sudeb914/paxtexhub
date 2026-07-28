import Image from "next/image";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { DeleteListingButton } from "@/components/dashboard/DeleteListingButton";
import { ListingStatusBadge } from "@/components/dashboard/ListingStatusBadge";
import type { SellerListing } from "@/types/seller-listing";

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function formatCreatedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : dateFormatter.format(date);
}

function formatPrice(listing: SellerListing) {
  if (listing.currency === "BDT") return `৳${new Intl.NumberFormat("en-US").format(listing.price)}`;
  return priceFormatter.format(listing.price);
}

export function SellerListingCard({ listing, onDeleted }: { listing: SellerListing; onDeleted: () => void }) {
  return (
    <article className="grid gap-5 border-b border-[#e8ebef] px-5 py-5 last:border-b-0 sm:px-6 lg:grid-cols-[minmax(220px,1.7fr)_minmax(100px,.7fr)_minmax(100px,.65fr)_minmax(115px,.8fr)_190px] lg:items-center lg:gap-4 lg:px-7 xl:grid-cols-[minmax(270px,1.7fr)_minmax(105px,.7fr)_minmax(100px,.65fr)_minmax(115px,.8fr)_300px]">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative h-[78px] w-[112px] shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-[124px]"><Image alt={listing.imageAlt} className="object-cover" fill sizes="124px" src={listing.featuredImage} /></div>
        <div className="min-w-0"><h2 className="truncate text-[16px] font-bold tracking-[-0.015em] text-[#111b2d]">{listing.title}</h2><p className="mt-2 text-sm font-semibold text-[#0864ff] lg:hidden">{formatPrice(listing)}</p></div>
      </div>

      <div className="hidden text-[15px] font-semibold text-[#172236] lg:block">{formatPrice(listing)}</div>
      <div><span className="mb-1.5 block text-xs font-medium text-[#8290a3] lg:hidden">Status</span><ListingStatusBadge status={listing.status} /></div>
      <div><span className="mb-1 block text-xs font-medium text-[#8290a3] lg:hidden">Created</span><time className="text-sm text-[#52627a]" dateTime={listing.createdAt}>{formatCreatedDate(listing.createdAt)}</time></div>
      <div className="flex items-center gap-2 lg:justify-end">
        <ActionLink href={listing.publicUrl} icon={<Eye />} label="View" />
        <ActionLink href={listing.editUrl} icon={<Pencil />} label="Edit" />
        <DeleteListingButton id={listing.id} onDeleted={onDeleted} title={listing.title} />
      </div>
    </article>
  );
}

function ActionLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link aria-label={label} className="inline-flex h-9 items-center gap-2 rounded-md border border-[#e1e6ec] px-3 text-xs font-semibold text-[#3e4d63] transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0864ff] [&>svg]:size-4" href={href}>{icon}<span className="sm:hidden xl:inline">{label}</span></Link>;
}
