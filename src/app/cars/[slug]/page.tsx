import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiCalendar, FiMapPin, FiTag } from "react-icons/fi";
import { LuGauge } from "react-icons/lu";
import { TbCarSuv } from "react-icons/tb";
import { ImageGallery } from "@/components/cars/image-gallery";
import { SellerCard } from "@/components/cars/seller-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getWordPressCarBySlug } from "@/services/wordpress/wordpress-single-service";

type Params = Promise<{ slug: string }>;
const number = new Intl.NumberFormat("en-US");
export const revalidate = 300;

function formatPrice(price: number) {
  return `৳${number.format(price)}`;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getWordPressCarBySlug(slug);
  if (!data) notFound();
  const { car } = data;
  return {
    title: car.title,
    description: `${car.title} for ${formatPrice(car.price)} in ${car.location}. View mileage, specifications, photos and listing details.`,
    alternates: { canonical: `/cars/${car.slug}` },
    openGraph: { title: car.title, description: car.description.slice(0, 160), images: car.images[0]?.url ? [car.images[0].url] : [] },
  };
}

export default async function CarDetailsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const data = await getWordPressCarBySlug(slug);
  if (!data) notFound();
  const { car, seller } = data;

  const specifications = [
    { label: "Mileage", value: `${number.format(car.mileage)} km`, icon: LuGauge },
    { label: "Location", value: car.location, icon: FiMapPin },
    { label: "Body Type", value: car.categoryId.toUpperCase(), icon: TbCarSuv },
    { label: "Brand", value: car.make, icon: FiTag },
    { label: "Model", value: car.model, icon: TbCarSuv },
    { label: "Model Year", value: String(car.year), icon: FiCalendar },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-surface-subtle py-10 sm:py-14">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link className="transition hover:text-primary" href="/">Home</Link><span aria-hidden="true">/</span>
            <Link className="transition hover:text-primary" href="/cars">Cars</Link><span aria-hidden="true">/</span>
            <span className="text-foreground">{car.title}</span>
          </nav>
          <div className="mt-5 rounded-xl border border-border bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,.06)] sm:p-7 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.42fr_.9fr] lg:items-start">
              <ImageGallery images={car.images} />
              <div>
                <div className="border-b border-border pb-6">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">{car.status}</span>
                  <h1 className="mt-3 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">{car.title}</h1>
                  <p className="mt-2 text-2xl font-bold text-primary">{formatPrice(car.price)}</p>
                </div>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-5 border-b border-border py-6">
                  {specifications.map(({ label, value, icon: Icon }) => (
                    <div className="flex items-start gap-2.5" key={label}>
                      <Icon className="mt-0.5 shrink-0 text-sm text-slate-700" aria-hidden="true" />
                      <div><dt className="text-[10px] uppercase tracking-wide text-muted">{label}</dt><dd className="mt-0.5 text-xs font-semibold text-foreground sm:text-sm">{value}</dd></div>
                    </div>
                  ))}
                </dl>
                <section className="border-b border-border py-6" aria-labelledby="description-heading">
                  <h2 className="text-sm font-bold" id="description-heading">Description</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">{car.description}</p>
                </section>
                {seller ? <div className="pt-6"><SellerCard listingId={Number(car.id)} seller={seller} /></div> : <div className="pt-6"><Link className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover" href="/contact">Contact About This Car</Link></div>}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
