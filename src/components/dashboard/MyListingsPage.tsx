"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { EmptyListingsState } from "@/components/dashboard/EmptyListingsState";
import { SellerListingCard } from "@/components/dashboard/SellerListingCard";
import type { MyListingsResponse, SellerListing } from "@/types/seller-listing";

export function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  const loadListings = useCallback(async (signal: AbortSignal) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/listings/my", { cache: "no-store", credentials: "same-origin", signal });
      if (response.status === 401) {
        router.replace("/login");
        router.refresh();
        return;
      }
      const data = await response.json().catch(() => ({})) as Partial<MyListingsResponse> & { error?: string };
      if (!response.ok) throw new Error(data.error || "Unable to load your listings.");
      setListings(Array.isArray(data.listings) ? data.listings : []);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError(requestError instanceof Error ? requestError.message : "Unable to load your listings.");
    } finally {
      if (!signal.aborted) setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();
    void loadListings(controller.signal);
    return () => controller.abort();
  }, [loadListings, requestKey]);

  return (
    <section>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-[30px] font-bold tracking-[-0.035em] text-[#0b1426] sm:text-[34px]">My Listings</h1><p className="mt-2 text-[15px] leading-6 text-[#627189] sm:text-base">Manage all the vehicles you have added to the marketplace.</p></div>
        <Link className="inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-[#0864ff] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0757dc]" href="/dashboard/add-listing"><Plus className="size-5" />Add New Listing</Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-[18px] border border-[#e8ebef] bg-white shadow-[0_5px_18px_rgba(20,31,50,.055)]">
        {isLoading ? <ListingsLoadingState /> : error ? <ListingsErrorState message={error} onRetry={() => setRequestKey((key) => key + 1)} /> : listings.length ? (
          <><ListingTableHeader /><div>{listings.map((listing) => <SellerListingCard key={listing.id} listing={listing} onDeleted={() => setListings((current) => current.filter((item) => item.id !== listing.id))} />)}</div></>
        ) : <EmptyListingsState />}
      </div>
    </section>
  );
}

function ListingTableHeader() {
  return <div className="hidden grid-cols-[minmax(220px,1.7fr)_minmax(100px,.7fr)_minmax(100px,.65fr)_minmax(115px,.8fr)_190px] items-center gap-4 border-b border-[#e8ebef] bg-[#fbfcfd] px-7 py-4 text-xs font-semibold uppercase tracking-[0.06em] text-[#7a889c] lg:grid xl:grid-cols-[minmax(270px,1.7fr)_minmax(105px,.7fr)_minmax(100px,.65fr)_minmax(115px,.8fr)_300px]"><span>Vehicle</span><span>Price</span><span>Status</span><span>Created</span><span className="text-right">Actions</span></div>;
}

function ListingsLoadingState() {
  return <div aria-label="Loading your listings" className="animate-pulse" role="status"><ListingTableHeader />{Array.from({ length: 3 }).map((_, index) => <div className="flex items-center gap-5 border-b border-[#e8ebef] px-5 py-5 last:border-b-0 sm:px-7" key={index}><div className="h-[78px] w-[124px] shrink-0 rounded-lg bg-slate-200" /><div className="flex-1"><div className="h-4 w-44 max-w-full rounded bg-slate-200" /><div className="mt-3 h-3 w-24 rounded bg-slate-100" /></div><div className="hidden h-8 w-28 rounded bg-slate-100 lg:block" /></div>)}</div>;
}

function ListingsErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center" role="alert"><div className="grid size-16 place-items-center rounded-full bg-red-50 text-red-500"><AlertCircle className="size-8" /></div><h2 className="mt-5 text-xl font-bold text-[#0b1426]">We couldn&apos;t load your listings</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#627189]">{message}</p><button className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4eb] px-4 text-sm font-semibold text-[#26364d] transition hover:bg-slate-50" onClick={onRetry} type="button"><RefreshCw className="size-4" />Try Again</button></div>;
}
