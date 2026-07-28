import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CarFront, ExternalLink, Globe2, MapPin, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
import { CarCard } from "@/components/cars/car-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getPublicSellerBySlug } from "@/services/wordpress/wordpress-seller-service";

type Params = Promise<{ slug: string }>;

function businessLabel(value: string) {
  return value ? value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") : "Verified Seller";
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const seller = await getPublicSellerBySlug((await params).slug).catch(() => null);
  if (!seller) return { title: "Seller Not Found" };
  return { title: `${seller.displayName} — Seller Profile`, description: seller.bio || `Browse vehicles listed by ${seller.displayName} on AutoHub.` };
}

export default async function SellerProfilePage({ params }: { params: Params }) {
  const seller = await getPublicSellerBySlug((await params).slug).catch(() => null);
  if (!seller) notFound();
  const contactUrl = `/contact?seller=${encodeURIComponent(seller.slug)}&subject=${encodeURIComponent(`Vehicle inquiry for ${seller.displayName}`)}`;

  return <>
    <Navbar />
    <main className="min-h-[70vh] bg-[#f8fafc] py-10 sm:py-14">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted"><Link className="transition hover:text-primary" href="/">Home</Link><span>/</span><Link className="transition hover:text-primary" href="/cars">Cars</Link><span>/</span><span className="text-foreground">{seller.displayName}</span></nav>

        <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_35px_rgba(15,23,42,.07)]">
          <div className="h-24 bg-[linear-gradient(120deg,#eaf2ff_0%,#f4f8ff_48%,#edf1ff_100%)] sm:h-32" />
          <div className="px-5 pb-7 sm:px-8 sm:pb-9">
            <div className="-mt-14 flex flex-col gap-6 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:text-left">
                <div className="size-28 shrink-0 rounded-full bg-gradient-to-br from-[#0864ff] via-[#38bdf8] to-[#4f46e5] p-1 shadow-[0_8px_24px_rgba(8,100,255,.22)] sm:size-32"><div className="relative grid size-full place-items-center overflow-hidden rounded-full border-[3px] border-white bg-slate-100 text-slate-500">{seller.avatarUrl ? <Image alt={`${seller.displayName} profile`} className="object-cover" fill priority sizes="128px" src={seller.avatarUrl} unoptimized /> : <UserRound className="size-16 stroke-[1.3]" />}</div></div>
                <div className="min-w-0 pb-1"><div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start"><h1 className="break-words text-2xl font-bold tracking-[-.03em] text-[#0b1426] sm:text-3xl">{seller.displayName}</h1><ShieldCheck className="size-5 text-[#0864ff]" /></div><p className="mt-1 text-sm font-medium text-[#52627a]">{seller.companyName || businessLabel(seller.businessType)}</p>{seller.location ? <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted sm:justify-start"><MapPin className="size-4" />{seller.location}</p> : null}</div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">{seller.phone ? <a className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe4eb] px-5 text-sm font-semibold text-[#26364d] transition hover:border-blue-200 hover:bg-blue-50" href={`tel:${seller.phone}`}><Phone className="size-4" />Call Seller</a> : null}<Link className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0864ff] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0757dc]" href={contactUrl}><MessageCircle className="size-4" />Contact Seller</Link></div>
            </div>
          </div>
        </section>

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-border bg-white p-6 shadow-[0_5px_20px_rgba(15,23,42,.05)] sm:p-8"><h2 className="text-xl font-bold text-[#0b1426]">About the seller</h2><p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-[#52627a]">{seller.bio || `${seller.displayName} is a verified seller on the AutoHub marketplace.`}</p></section>
          <aside className="rounded-2xl border border-border bg-white p-6 shadow-[0_5px_20px_rgba(15,23,42,.05)]"><h2 className="text-lg font-bold text-[#0b1426]">Seller details</h2><div className="mt-5 space-y-4 text-sm">{seller.companyName ? <Detail icon={<Building2 />} label="Company" value={seller.companyName} /> : null}<Detail icon={<ShieldCheck />} label="Seller type" value={businessLabel(seller.businessType)} />{seller.website ? <a className="flex items-start gap-3 text-[#52627a] transition hover:text-[#0864ff]" href={seller.website} rel="noreferrer" target="_blank"><Globe2 className="mt-0.5 size-5 shrink-0" /><span className="min-w-0"><span className="block text-xs text-muted">Website</span><span className="mt-0.5 block truncate font-medium">Visit website</span></span><ExternalLink className="ml-auto size-4 shrink-0" /></a> : null}</div>{seller.socialLinks.length ? <div className="mt-6 border-t border-border pt-5"><p className="text-xs font-semibold uppercase tracking-wider text-muted">Social links</p><div className="mt-3 flex flex-wrap gap-2">{seller.socialLinks.map((item) => <a className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-[#3e4d63] transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0864ff]" href={item.url} key={item.label} rel="noreferrer" target="_blank">{item.label}</a>)}</div></div> : null}</aside>
        </div>

        <section className="mt-10"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-[#0864ff]">SELLER INVENTORY</p><h2 className="mt-1 text-2xl font-bold tracking-[-.03em] text-[#0b1426]">Cars listed by {seller.displayName}</h2></div><p className="text-sm text-muted">{seller.cars.length} {seller.cars.length === 1 ? "vehicle" : "vehicles"}</p></div>{seller.cars.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{seller.cars.map((car) => <CarCard car={car} key={car.id} />)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-[#d9e0e9] bg-white px-6 py-16 text-center"><CarFront className="mx-auto size-10 text-[#8290a3]" /><h3 className="mt-4 font-bold text-[#0b1426]">No active listings</h3><p className="mt-2 text-sm text-muted">This seller doesn&apos;t have any published vehicles right now.</p></div>}</section>
      </div>
    </main>
    <Footer />
  </>;
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-start gap-3 text-[#52627a] [&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0"><>{icon}</><span><span className="block text-xs text-muted">{label}</span><span className="mt-0.5 block font-medium text-[#26364d]">{value}</span></span></div>;
}
