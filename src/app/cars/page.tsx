import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CarListItem } from "@/components/cars/car-list-item";
import { CarListSkeleton } from "@/components/cars/car-list-skeleton";
import { ListingFilters } from "@/components/cars/listing-filters";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { getWordPressCars } from "@/services/wordpress/wordpress-listing-service";
import type { WordPressListingFilters } from "@/services/wordpress/wordpress-listing-service";
import { getWordPressTaxonomies } from "@/services/wordpress/wordpress-api";

export const metadata: Metadata = {
  title: "Cars for Sale",
  description: "Browse trusted new and used cars for sale on AutoHub.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CarsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const query = {
    brand: first(raw.brand),
    "car-type": first(raw["car-type"]),
    location: first(raw.location),
    sort: first(raw.sort),
    page: first(raw.page),
  };
  const filters: WordPressListingFilters = {
    brand: query.brand,
    carType: query["car-type"],
    location: query.location,
    sort: query.sort === "price-asc" || query.sort === "price-desc" ? query.sort : "newest",
    page: Number.parseInt(query.page ?? "1", 10) || 1,
  };
  let taxonomies: Awaited<ReturnType<typeof getWordPressTaxonomies>> = { brands: [], carTypes: [], locations: [] };
  try {
    taxonomies = await getWordPressTaxonomies();
  } catch (error) {
    console.error("Unable to load WordPress car taxonomies", error);
  }
  const resultsKey = [query.brand, query["car-type"], query.location, filters.sort, filters.page].join(":");

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-surface-subtle py-10 sm:py-14">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted">
            <Link className="transition hover:text-primary" href="/">Home</Link><span aria-hidden="true">/</span><span className="text-foreground">Cars</span>
          </nav>
          <div className="mt-5 rounded-xl border border-border bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,.06)] sm:p-7 lg:p-8">
            <h1 className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">All Cars</h1>
            <div className="mt-7"><Suspense fallback={<div className="h-11 animate-pulse rounded-md bg-slate-100" />}><ListingFilters brands={taxonomies.brands} carTypes={taxonomies.carTypes} locations={taxonomies.locations} /></Suspense></div>
            <div className="my-7 h-px bg-border" />
            <Suspense fallback={<CarListSkeleton />} key={resultsKey}>
              <CarResults filters={filters} query={query} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

async function CarResults({ filters, query }: { filters: WordPressListingFilters; query: Record<string, string | undefined> }) {
  try {
    const result = await getWordPressCars(filters);
    return (
      <>
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">{result.totalItems} {result.totalItems === 1 ? "vehicle" : "vehicles"} available</p>
          {result.totalItems > 0 ? <p className="text-xs text-muted">Page {result.page} of {result.totalPages}</p> : null}
        </div>
        {result.items.length ? <div className="space-y-4">{result.items.map((car) => <CarListItem car={car} key={car.id} />)}</div> : <EmptyState />}
        <Pagination page={result.page} query={query} totalPages={result.totalPages} />
      </>
    );
  } catch (error) {
    console.error("Unable to load WordPress car listings", error);
    return <EmptyState />;
  }
}
