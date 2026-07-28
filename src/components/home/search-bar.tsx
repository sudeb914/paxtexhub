"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import type { TaxonomyOption } from "@/types/wordpress";

const fieldClass = "h-11 appearance-none rounded-md border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export function SearchBar({ brands, carTypes, locations }: { brands: TaxonomyOption[]; carTypes: TaxonomyOption[]; locations: TaxonomyOption[] }) {
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const key of ["brand", "car-type", "location"]) {
      const value = form.get(key);
      if (typeof value === "string" && value) params.set(key, value);
    }
    router.push(`/cars${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <form className="grid gap-2 rounded-lg bg-white p-2 shadow-xl sm:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={submit}>
      <SelectField label="All Brands" name="brand" options={brands} />
      <SelectField label="All Car Types" name="car-type" options={carTypes} />
      <SelectField label="All Locations" name="location" options={locations} />
      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary" type="submit">
        <FiSearch aria-hidden="true" />
        <span>Search Cars</span>
      </button>
    </form>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: TaxonomyOption[] }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select className={`${fieldClass} w-full`} defaultValue="" name={name}>
        <option value="">{label}</option>
        {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
    </label>
  );
}
