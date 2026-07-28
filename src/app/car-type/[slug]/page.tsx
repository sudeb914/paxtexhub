import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArchiveSort } from "@/components/cars/archive-sort";
import { CarListItem } from "@/components/cars/car-list-item";
import { CarListSkeleton } from "@/components/cars/car-list-skeleton";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Pagination } from "@/components/shared/pagination";
import { getWordPressCarTypeBySlug, getWordPressTaxonomies } from "@/services/wordpress/wordpress-api";
import { getWordPressCars } from "@/services/wordpress/wordpress-listing-service";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateStaticParams() {
  try {
    const { carTypes } = await getWordPressTaxonomies();
    return carTypes.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const term = await getWordPressCarTypeBySlug(slug).catch(() => null);
  if (!term) return { title: "Car Type Not Found", robots: { index: false, follow: false } };
  return {
    title: `${term.name} Cars for Sale`,
    description: `Browse ${term.count} ${term.name} cars for sale from trusted sellers on AutoHub.`,
    alternates: { canonical: `/car-type/${term.slug}` },
  };
}

export default async function CarTypeArchivePage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ slug }, raw] = await Promise.all([params, searchParams]);
  const term = await getWordPressCarTypeBySlug(slug).catch(() => null);
  if (!term) notFound();

  const requestedSort = first(raw.sort);
  const sort = requestedSort === "price-asc" || requestedSort === "price-desc" ? requestedSort : "newest";
  const page = Math.max(1, Number.parseInt(first(raw.page) ?? "1", 10) || 1);
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-surface-subtle py-10 sm:py-14">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <Link className="transition hover:text-primary" href="/">Home</Link><span aria-hidden="true">/</span>
            <Link className="transition hover:text-primary" href="/cars">Cars</Link><span aria-hidden="true">/</span>
            <span className="text-foreground">{term.name}</span>
          </nav>
          <section className="mt-5 rounded-xl border border-border bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,.06)] sm:p-7 lg:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">{term.name} Cars for Sale</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{term.description || `Browse available ${term.name} vehicles from trusted sellers.`}</p>
              </div>
              <Suspense fallback={<div className="h-10 w-44 animate-pulse rounded-md bg-slate-100" />}><ArchiveSort value={sort} /></Suspense>
            </div>
            <div className="my-7 h-px bg-border" />
            <Suspense fallback={<CarListSkeleton />} key={`${term.id}:${sort}:${page}`}>
              <ArchiveResults basePath={`/car-type/${term.slug}`} page={page} sort={sort} termId={term.id} />
            </Suspense>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

async function ArchiveResults({ basePath, page, sort, termId }: { basePath: string; page: number; sort: "newest" | "price-asc" | "price-desc"; termId: number }) {
  const result = await getWordPressCars({ carType: String(termId), page, sort });
  return (
    <>
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{result.totalItems} {result.totalItems === 1 ? "vehicle" : "vehicles"} available</p>
        {result.totalItems > 0 ? <p className="text-xs text-muted">Page {result.page} of {result.totalPages}</p> : null}
      </div>
      {result.items.length ? (
        <div className="space-y-4">{result.items.map((car) => <CarListItem car={car} key={car.id} />)}</div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-6 py-14 text-center">
          <h2 className="text-lg font-bold">No cars in this category yet</h2>
          <p className="mt-2 text-sm text-muted">Please check again later or browse all available cars.</p>
          <Link className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-white" href="/cars">Browse all cars</Link>
        </div>
      )}
      <Pagination basePath={basePath} page={result.page} query={{ sort: sort === "newest" ? undefined : sort }} totalPages={result.totalPages} />
    </>
  );
}
