import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CarFront, CheckCircle2, ExternalLink, Globe2, MapPin, MessageCircle, Phone, ShieldCheck, UserRound } from "lucide-react";
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
  const sellerType = businessLabel(seller.businessType);

  return <>
    <Navbar />
    <main className="min-h-[70vh] bg-[#f6f8fb] py-8 sm:py-12">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 px-1 text-xs text-muted"><Link className="transition hover:text-primary" href="/">Home</Link><span>/</span><Link className="transition hover:text-primary" href="/cars">Cars</Link><span>/</span><span className="font-medium text-foreground">{seller.displayName}</span></nav>

        <section className="relative mt-5 overflow-hidden rounded-[22px] bg-[#07111f] px-5 py-7 text-white shadow-[0_18px_45px_rgba(7,17,31,.18)] sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-[#0864ff]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col items-center gap-5 text-center sm:flex-row sm:gap-6 sm:text-left">
              <div className="size-28 shrink-0 rounded-full bg-gradient-to-br from-[#0864ff] via-[#38bdf8] to-[#4f46e5] p-1 shadow-[0_10px_30px_rgba(8,100,255,.3)] sm:size-32"><div className="relative grid size-full place-items-center overflow-hidden rounded-full border-[3px] border-white/90 bg-slate-100 text-slate-500">{seller.avatarUrl ? <Image alt={`${seller.displayName} profile`} className="object-cover" fill priority sizes="128px" src={seller.avatarUrl} unoptimized /> : <UserRound className="size-16 stroke-[1.3]" />}</div></div>
              <div className="min-w-0"><div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start"><h1 className="break-words text-[28px] font-bold leading-tight tracking-[-.035em] sm:text-[34px]">{seller.displayName}</h1><ShieldCheck className="size-6 text-[#55a0ff]" /></div><p className="mt-2 text-[15px] font-medium text-slate-300">{seller.companyName || sellerType}</p><div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start"><HeroBadge icon={<CheckCircle2 />} text={sellerType} /><HeroBadge icon={<CarFront />} text={`${seller.cars.length} ${seller.cars.length === 1 ? "active listing" : "active listings"}`} />{seller.location ? <HeroBadge icon={<MapPin />} text={seller.location} /> : null}</div></div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:shrink-0">{seller.phoneIsPublic && seller.phone ? <a className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15" href={`tel:${seller.phone}`}><Phone className="size-[18px]" />Call Seller</a> : null}<Link className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#0864ff] px-6 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(8,100,255,.3)] transition hover:bg-[#2376ff]" href={contactUrl}><MessageCircle className="size-[18px]" />Contact Seller</Link></div>
          </div>
        </section>

        <div className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="min-w-0 space-y-7">
            <section className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_6px_22px_rgba(15,23,42,.045)] sm:p-8"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-lg bg-blue-50 text-[#0864ff]"><UserRound className="size-5" /></div><h2 className="text-xl font-bold tracking-[-.02em] text-[#0b1426]">About {seller.displayName}</h2></div><p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-[#52627a]">{seller.bio || `${seller.displayName} is a verified seller on the AutoHub marketplace.`}</p></section>

            <section className="rounded-2xl border border-[#e3e8ef] bg-white p-5 shadow-[0_6px_22px_rgba(15,23,42,.045)] sm:p-7"><div className="flex flex-col gap-2 border-b border-[#edf0f4] pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#0864ff]">Seller inventory</p><h2 className="mt-2 text-2xl font-bold tracking-[-.03em] text-[#0b1426]">Available vehicles</h2></div><p className="text-sm font-medium text-muted">{seller.cars.length} {seller.cars.length === 1 ? "vehicle" : "vehicles"}</p></div>{seller.cars.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2">{seller.cars.map((car) => <CarCard car={car} key={car.id} />)}</div> : <div className="py-16 text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-slate-100"><CarFront className="size-8 text-[#8290a3]" /></div><h3 className="mt-4 font-bold text-[#0b1426]">No active listings</h3><p className="mt-2 text-sm text-muted">This seller doesn&apos;t have any published vehicles right now.</p></div>}</section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_6px_22px_rgba(15,23,42,.045)]"><h2 className="text-lg font-bold text-[#0b1426]">Seller information</h2><div className="mt-5 space-y-5">{seller.companyName ? <Detail icon={<Building2 />} label="Company" value={seller.companyName} /> : null}<Detail icon={<ShieldCheck />} label="Seller type" value={sellerType} />{seller.location ? <Detail icon={<MapPin />} label="Location" value={seller.location} /> : null}{seller.phone ? <Detail icon={<Phone />} label={seller.phoneIsPublic ? "Phone" : "Phone (private)"} value={seller.phone} /> : null}{seller.website ? <a className="flex items-start gap-3 text-[#52627a] transition hover:text-[#0864ff]" href={seller.website} rel="noreferrer" target="_blank"><Globe2 className="mt-0.5 size-5 shrink-0" /><span className="min-w-0"><span className="block text-xs text-muted">Website</span><span className="mt-0.5 block truncate font-semibold">Visit seller website</span></span><ExternalLink className="ml-auto size-4 shrink-0" /></a> : null}</div>{seller.socialLinks.length ? <div className="mt-6 border-t border-[#edf0f4] pt-5"><p className="text-xs font-bold uppercase tracking-[.1em] text-muted">Follow seller</p><div className="mt-3 flex flex-wrap gap-2">{seller.socialLinks.map((item) => <a className="rounded-md border border-[#e1e6ec] px-3 py-2 text-xs font-semibold text-[#3e4d63] transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0864ff]" href={item.url} key={item.label} rel="noreferrer" target="_blank">{item.label}</a>)}</div></div> : null}</section>
            <section className="rounded-2xl bg-[#eaf2ff] p-6"><div className="grid size-10 place-items-center rounded-lg bg-white text-[#0864ff] shadow-sm"><MessageCircle className="size-5" /></div><h2 className="mt-4 text-lg font-bold text-[#0b1426]">Interested in a vehicle?</h2><p className="mt-2 text-sm leading-6 text-[#52627a]">Send the seller an inquiry and mention the car you&apos;re interested in.</p><Link className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0864ff] px-5 text-sm font-semibold text-white transition hover:bg-[#0757dc]" href={contactUrl}>Contact Seller</Link></section>
          </aside>
        </div>
      </div>
    </main>
    <Footer />
  </>;
}

function HeroBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[.08] px-3 py-1.5 text-xs font-medium text-slate-200 [&>svg]:size-3.5">{icon}{text}</span>;
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-start gap-3 text-[#52627a] [&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0"><>{icon}</><span><span className="block text-xs text-muted">{label}</span><span className="mt-0.5 block font-semibold text-[#26364d]">{value}</span></span></div>;
}
