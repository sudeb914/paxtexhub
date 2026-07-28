"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import type { EditableSellerListing } from "@/types/edit-listing";
import type { TaxonomyOption } from "@/types/wordpress";

const inputClass = "mt-2 h-11 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 text-sm text-[#172236] outline-none transition focus:border-[#0864ff] focus:ring-2 focus:ring-blue-100";
type Errors = Record<string, string>;

export function EditListingForm({ listing, brands, carTypes, locations }: { listing: EditableSellerListing; brands: TaxonomyOption[]; carTypes: TaxonomyOption[]; locations: TaxonomyOption[] }) {
  const router = useRouter(); const [isSubmitting, setIsSubmitting] = useState(false); const [error, setError] = useState(""); const [errors, setErrors] = useState<Errors>({}); const [success, setSuccess] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (isSubmitting) return; setIsSubmitting(true); setError(""); setErrors({});
    try {
      const response = await fetch(`/api/listings/${listing.id}`, { method: "PATCH", body: new FormData(event.currentTarget) });
      const result = await response.json().catch(() => ({})) as { error?: string; fieldErrors?: Errors };
      if (response.status === 401) { router.replace("/login"); router.refresh(); return; }
      if (!response.ok) { setError(result.error || "Unable to update the listing."); setErrors(result.fieldErrors ?? {}); return; }
      setSuccess(true); window.setTimeout(() => { router.push("/dashboard/listings"); router.refresh(); }, 900);
    } catch { setError("Unable to connect. Please try again."); } finally { setIsSubmitting(false); }
  }
  return <form className="mt-8" onSubmit={submit}>
    {error ? <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert"><AlertCircle className="size-5 shrink-0" />{error}</div> : null}
    {success ? <div className="mb-6 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status"><CheckCircle2 className="size-5" />Listing updated and moved to pending review. Redirecting...</div> : null}
    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
      <Field defaultValue={listing.title} error={errors.title} label="Listing title" name="title" />
      <Field defaultValue={listing.model} error={errors.model} label="Model" name="model" />
      <Select defaultValue={listing.brandId} label="Brand" name="brandId" options={brands} />
      <Select defaultValue={listing.carTypeId} label="Body type" name="carTypeId" options={carTypes} />
      <Field defaultValue={listing.year} label="Year" name="year" type="number" />
      <Field defaultValue={listing.price} label="Price (BDT)" min="1" name="price" type="number" />
      <Field defaultValue={listing.mileage} label="Mileage (km)" min="0" name="mileage" type="number" />
      <Select defaultValue={listing.locationId} label="Location" name="locationId" options={locations} />
      <label className="text-sm font-semibold text-[#172236] sm:col-span-2">Description<textarea className="mt-2 min-h-40 w-full rounded-lg border border-[#dfe4eb] px-3.5 py-3 text-sm outline-none focus:border-[#0864ff] focus:ring-2 focus:ring-blue-100" defaultValue={listing.description} name="description" required />{errors.description ? <small className="mt-1 block text-red-600">{errors.description}</small> : null}</label>
      <MediaField existing={listing.featuredImage ? [listing.featuredImage.url] : []} label="Replace featured image" name="featuredImage" />
      <MediaField existing={listing.galleryImages.map((image) => image.url)} label="Replace gallery images" multiple name="galleryImages" />
    </div>
    <p className="mt-4 text-xs leading-5 text-[#7a889c]">Leave image fields empty to keep existing images. Selecting gallery images replaces the current gallery. Saving changes moves the listing to pending review.</p>
    <div className="mt-8 flex justify-end border-t border-[#e8ebef] pt-6"><button className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0864ff] px-6 text-sm font-semibold text-white disabled:opacity-60" disabled={isSubmitting || success} type="submit"><Save className="size-4" />{isSubmitting ? "Saving..." : "Save Changes"}</button></div>
  </form>;
}

function Field({ label, name, defaultValue, type = "text", min, error }: { label: string; name: string; defaultValue: string | number; type?: string; min?: string; error?: string }) { return <label className="text-sm font-semibold text-[#172236]">{label}<input className={inputClass} defaultValue={defaultValue} min={min} name={name} required type={type} />{error ? <small className="mt-1 block text-red-600">{error}</small> : null}</label>; }
function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: number; options: TaxonomyOption[] }) { return <label className="text-sm font-semibold text-[#172236]">{label}<select className={inputClass} defaultValue={defaultValue} name={name} required>{options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></label>; }
function MediaField({ label, name, existing, multiple = false }: { label: string; name: string; existing: string[]; multiple?: boolean }) { return <div className="text-sm font-semibold text-[#172236]"><p>{label}</p>{existing.length ? <div className="mt-2 flex gap-2 overflow-x-auto">{existing.map((url) => <div className="size-20 shrink-0 rounded-lg bg-cover bg-center ring-1 ring-[#dfe4eb]" key={url} style={{ backgroundImage: `url(${url})` }} />)}</div> : <p className="mt-2 text-xs font-normal text-[#7a889c]">No existing image</p>}<input accept="image/jpeg,image/png,image/webp" className="mt-3 block w-full text-xs text-[#627189] file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#0864ff]" multiple={multiple} name={name} type="file" /></div>; }
