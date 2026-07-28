"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, ImagePlus, Send } from "lucide-react";
import type { TaxonomyOption } from "@/types/wordpress";

type FieldErrors = Record<string, string>;
const inputClass = "mt-2 h-11 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 text-sm text-[#172236] outline-none transition placeholder:text-slate-400 focus:border-[#0864ff] focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50";

export function AddListingForm({ brands, carTypes, locations }: { brands: TaxonomyOption[]; carTypes: TaxonomyOption[]; locations: TaxonomyOption[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setIsSubmitting(true); setError(""); setFieldErrors({});
    try {
      const response = await fetch("/api/listings", { method: "POST", body: data });
      const result = await response.json().catch(() => ({})) as { error?: string; fieldErrors?: FieldErrors };
      if (response.status === 401) { router.replace("/login"); router.refresh(); return; }
      if (!response.ok) { setError(result.error || "Unable to create the listing."); setFieldErrors(result.fieldErrors ?? {}); return; }
      setSuccess(true);
      window.setTimeout(() => { router.push("/dashboard/listings"); router.refresh(); }, 900);
    } catch { setError("Unable to connect. Check your internet connection and try again."); }
    finally { setIsSubmitting(false); }
  }

  return (
    <form className="mt-8" onSubmit={submit}>
      {error ? <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</div> : null}
      {success ? <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700" role="status"><CheckCircle2 className="size-5" />Listing submitted for review. Redirecting to My Listings...</div> : null}
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <Field error={fieldErrors.title} label="Listing title" name="title" placeholder="e.g. 2023 BMW X5" />
        <Field error={fieldErrors.model} label="Model" name="model" placeholder="e.g. X5" />
        <SelectField error={fieldErrors.brandId} label="Brand" name="brandId" options={brands} placeholder="Select brand" />
        <SelectField error={fieldErrors.carTypeId} label="Body type" name="carTypeId" options={carTypes} placeholder="Select body type" />
        <Field error={fieldErrors.year} label="Year" name="year" placeholder="e.g. 2023" type="number" />
        <Field error={fieldErrors.price} label="Price (BDT)" min="1" name="price" placeholder="e.g. 5800000" type="number" />
        <Field error={fieldErrors.mileage} label="Mileage (km)" min="0" name="mileage" placeholder="e.g. 25000" type="number" />
        <SelectField error={fieldErrors.locationId} label="Location" name="locationId" options={locations} placeholder="Select location" />
        <label className="text-sm font-semibold text-[#172236] sm:col-span-2">Description<textarea className="mt-2 min-h-40 w-full resize-y rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0864ff] focus:ring-2 focus:ring-blue-100" name="description" placeholder="Describe the car, its condition, features, and history..." required />{fieldErrors.description ? <span className="mt-1.5 block text-xs font-medium text-red-600">{fieldErrors.description}</span> : null}</label>
        <ImageUploadField error={fieldErrors.featuredImage} label="Featured image" name="featuredImage" required />
        <ImageUploadField error={fieldErrors.galleryImages} label="Gallery images" maxFiles={5} multiple name="galleryImages" />
      </div>
      <div className="mt-8 flex items-center justify-end border-t border-[#e8ebef] pt-6"><button className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0864ff] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0757dc] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting || success} type="submit"><Send className="size-4" />{isSubmitting ? "Submitting..." : "Submit Listing"}</button></div>
    </form>
  );
}

function ImageUploadField({ label, name, multiple = false, maxFiles = 1, required = false, error }: { label: string; name: string; multiple?: boolean; maxFiles?: number; required?: boolean; error?: string }) {
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => () => { previews.forEach(URL.revokeObjectURL); }, [previews]);
  function selectImages(event: ChangeEvent<HTMLInputElement>) {
    previews.forEach(URL.revokeObjectURL);
    const files = Array.from(event.target.files ?? []).slice(0, maxFiles);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }
  return <div className="text-sm font-semibold text-[#172236]"><p>{label}{required ? <span className="text-red-500"> *</span> : null}</p><label className="mt-2 flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#cfd7e2] bg-[#fbfcfe] px-4 py-5 text-center transition hover:border-[#0864ff] hover:bg-blue-50/40"><ImagePlus className="size-7 text-[#0864ff]" /><span className="mt-2 text-sm font-semibold text-[#33445c]">Choose {multiple ? "images" : "an image"}</span><span className="mt-1 text-xs font-normal text-[#7a889c]">JPG, PNG or WebP · max 5 MB{multiple ? ` · up to ${maxFiles}` : ""}</span><input accept="image/jpeg,image/png,image/webp" className="sr-only" multiple={multiple} name={name} onChange={selectImages} required={required} type="file" /></label>{previews.length ? <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">{previews.map((preview, index) => <div aria-label={`${label} preview ${index + 1}`} className="aspect-square rounded-lg bg-cover bg-center ring-1 ring-[#dfe4eb]" key={preview} style={{ backgroundImage: `url(${preview})` }} />)}</div> : null}{error ? <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span> : null}</div>;
}

function Field({ label, name, placeholder, type = "text", min, error }: { label: string; name: string; placeholder: string; type?: string; min?: string; error?: string }) {
  return <label className="text-sm font-semibold text-[#172236]">{label}<input className={inputClass} min={min} name={name} placeholder={placeholder} required type={type} />{error ? <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span> : null}</label>;
}

function SelectField({ label, name, placeholder, options, error }: { label: string; name: string; placeholder: string; options: TaxonomyOption[]; error?: string }) {
  return <label className="text-sm font-semibold text-[#172236]">{label}<select className={inputClass} defaultValue="" name={name} required><option disabled value="">{placeholder}</option>{options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select>{error ? <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span> : null}</label>;
}
