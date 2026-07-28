"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiChevronDown, FiSliders, FiX } from "react-icons/fi";
import type { TaxonomyOption } from "@/types/wordpress";

export function ListingFilters({ brands, carTypes, locations }: { brands: TaxonomyOption[]; carTypes: TaxonomyOption[]; locations: TaxonomyOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["brand", "car-type", "location", "sort"]) {
      const value = data.get(key);
      if (typeof value === "string" && value) params.set(key, value);
    }
    startTransition(() => router.push(`/cars${params.size ? `?${params.toString()}` : ""}`));
    setExpanded(false);
  }

  const hasFilters = ["brand", "car-type", "location", "sort"].some((key) => searchParams.has(key));

  return (
    <div>
      <button className="mb-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-white text-sm font-semibold md:hidden" onClick={() => setExpanded((value) => !value)} type="button">
        <FiSliders aria-hidden="true" /> Filters & Sort
      </button>
      <form className={`${expanded ? "grid" : "hidden"} gap-3 rounded-lg border border-border bg-white p-4 shadow-sm md:grid md:grid-cols-[1fr_1fr_1.1fr_1.1fr_auto] md:border-0 md:p-0 md:shadow-none`} onSubmit={apply}>
        <TermSelect label="All Brands" name="brand" options={brands} value={searchParams.get("brand") ?? ""} />
        <TermSelect label="All Car Types" name="car-type" options={carTypes} value={searchParams.get("car-type") ?? ""} />
        <TermSelect label="All Locations" name="location" options={locations} value={searchParams.get("location") ?? ""} />
        <SortSelect value={searchParams.get("sort") ?? "newest"} />
        <div className="flex gap-2">
          <button className="h-11 flex-1 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-wait disabled:opacity-70 md:flex-none" disabled={isPending} type="submit">{isPending ? "Loading…" : "Filter"}</button>
          {hasFilters ? <button aria-label="Clear filters" className="grid size-11 place-items-center rounded-md border border-border text-muted transition hover:text-foreground disabled:cursor-wait disabled:opacity-60" disabled={isPending} onClick={() => startTransition(() => router.push("/cars"))} type="button"><FiX /></button> : null}
        </div>
      </form>
    </div>
  );
}

function TermSelect({ label, name, options, value }: { label: string; name: string; options: TaxonomyOption[]; value: string }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select className="h-11 w-full appearance-none rounded-md border border-border bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" defaultValue={value} name={name}>
        <option value="">{label}</option>
        {options.map((option) => <option key={option.id} value={option.id}>{option.name} ({option.count})</option>)}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
    </label>
  );
}

function SortSelect({ value }: { value: string }) {
  return (
    <label className="relative">
      <span className="sr-only">Sort cars</span>
      <select className="h-11 w-full appearance-none rounded-md border border-border bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" defaultValue={value} name="sort">
        <option value="newest">Sort by: Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
    </label>
  );
}
