"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfilePhotoUploader } from "@/components/dashboard/ProfilePhotoUploader";
import type { BusinessType, SellerProfileResponse } from "@/types/seller-profile";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import { ProfileCompletionAlert } from "@/components/dashboard/ProfileCompletionAlert";

type EditableProfile = Omit<SellerProfileResponse, "id">;
type Errors = Partial<Record<keyof EditableProfile, string>>;
const inputClass = "mt-2 h-11 w-full rounded-lg border border-[#d9dee6] bg-white px-3.5 text-sm text-[#172236] outline-none transition focus:border-[#0864ff] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-[#f5f7fa] disabled:text-[#718096]";
const businessTypes: Array<{ value: BusinessType; label: string }> = [{ value: "", label: "Select business type" }, { value: "car-dealer", label: "Car Dealer" }, { value: "dealership", label: "Dealership" }, { value: "broker", label: "Broker" }];

export function ProfileForm({ initialProfile }: { initialProfile: SellerProfileResponse }) {
  const router = useRouter();
  const editable = useMemo(() => { const { id: _id, ...profile } = initialProfile; void _id; return profile; }, [initialProfile]);
  const [saved, setSaved] = useState(editable); const [form, setForm] = useState(editable); const [photoFile, setPhotoFile] = useState<File | null>(null); const [errors, setErrors] = useState<Errors>({}); const [generalError, setGeneralError] = useState(""); const [saving, setSaving] = useState(false); const [success, setSuccess] = useState(false);
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved) || Boolean(photoFile), [form, saved, photoFile]);
  const completion = useMemo(() => calculateProfileCompletion(form), [form]);
  function update<K extends keyof EditableProfile>(key: K, value: EditableProfile[K]) { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })); setGeneralError(""); setSuccess(false); }
  function validate() {
    const next: Errors = {}; const required: Array<keyof EditableProfile> = ["firstName", "lastName", "displayName", "email"];
    required.forEach((key) => { if (typeof form[key] === "string" && !form[key].trim()) next[key] = "This field is required."; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.phone && (!/^[+()\-\s\d.]+$/.test(form.phone) || form.phone.replace(/\D/g, "").length < 7)) next.phone = "Enter a valid phone number.";
    (["website", "facebook", "instagram", "linkedin", "youtube"] as const).forEach((key) => { if (form[key]) { try { const url = new URL(form[key]); if (!/^https?:$/.test(url.protocol)) throw new Error(); } catch { next[key] = "Enter a complete http:// or https:// URL."; } } });
    setErrors(next); return Object.keys(next).length === 0;
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); if (!validate() || saving) return; setSaving(true); setSuccess(false); setGeneralError("");
    try {
      let profilePhotoId = form.profileImage ? form.profilePhotoId : null;
      let uploadedUrl = form.profileImage;
      if (photoFile) {
        const data = new FormData(); data.append("photo", photoFile);
        const upload = await fetch("/api/profile/photo", { method: "POST", body: data });
        const uploadBody = await upload.json() as { id?: number; url?: string | null; error?: string };
        if (upload.status === 401) { router.replace("/login"); return; }
        if (!upload.ok || typeof uploadBody.id !== "number") throw new Error(uploadBody.error ?? "Unable to upload the profile photo.");
        profilePhotoId = uploadBody.id; uploadedUrl = uploadBody.url ?? form.profileImage;
      }
      const response = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, profilePhotoId, profileImage: undefined, username: undefined }) });
      const body = await response.json() as { profile?: SellerProfileResponse; error?: string; fieldErrors?: Record<string, string> };
      if (response.status === 401) { router.replace("/login"); return; }
      if (!response.ok || !body.profile) { if (body.fieldErrors) setErrors(body.fieldErrors as Errors); throw new Error(body.error ?? "Unable to save your profile."); }
      const { id: _id, ...savedProfile } = body.profile; void _id;
      const next = { ...savedProfile, profileImage: body.profile.profileImage ?? uploadedUrl };
      setForm(next); setSaved(next); setPhotoFile(null); setSuccess(true); router.refresh(); window.setTimeout(() => setSuccess(false), 4000);
    } catch (error) { setGeneralError(error instanceof Error ? error.message : "Unable to save your profile."); } finally { setSaving(false); }
  }
  function cancel() { setForm(saved); setPhotoFile(null); setErrors({}); setGeneralError(""); setSuccess(false); }

  return <form onSubmit={submit}>
    <div className="mb-8"><ProfileCompletionAlert compact completion={completion} /></div>
    <ProfilePhotoUploader image={form.profileImage} name={form.displayName} onChange={(image) => update("profileImage", image)} onFileChange={setPhotoFile} />
    {success ? <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700" role="status"><CheckCircle2 className="size-5" />Profile changes saved successfully.</div> : null}
    {generalError ? <div className="mx-auto mt-6 max-w-xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700" role="alert">{generalError}</div> : null}
    <FormSection title="Personal Information"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><TextField error={errors.firstName} label="First Name" metaKey="first_name" value={form.firstName} onChange={(v) => update("firstName", v)} /><TextField error={errors.lastName} label="Last Name" metaKey="last_name" value={form.lastName} onChange={(v) => update("lastName", v)} /><TextField error={errors.displayName} label="Display Name" metaKey="display_name" value={form.displayName} onChange={(v) => update("displayName", v)} /><TextField disabled label="Username" metaKey="username" value={form.username} onChange={() => undefined} /><TextField error={errors.email} label="Email Address" metaKey="email" type="email" value={form.email} onChange={(v) => update("email", v)} /><TextField error={errors.phone} label="Phone Number" metaKey="phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} /></div></FormSection>
    <FormSection title="Business Information"><div className="grid gap-5 sm:grid-cols-2"><TextField label="Company Name" metaKey="company_name" value={form.companyName} onChange={(v) => update("companyName", v)} /><SelectField value={form.businessType} onChange={(value) => update("businessType", value)} /><TextField error={errors.website} label="Website" metaKey="website" type="url" value={form.website} onChange={(v) => update("website", v)} /><label className="text-sm font-semibold text-[#172236] sm:col-span-2">Bio<textarea className="mt-2 min-h-28 w-full resize-y rounded-lg border border-[#d9dee6] px-3.5 py-3 text-sm outline-none focus:border-[#0864ff] focus:ring-2 focus:ring-blue-100" name="bio" value={form.bio} onChange={(e) => update("bio", e.target.value)} />{errors.bio ? <span className="mt-1.5 block text-xs text-red-600">{errors.bio}</span> : null}</label></div></FormSection>
    <FormSection title="Address"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><TextField error={errors.country} label="Country" metaKey="country" value={form.country} onChange={(v) => update("country", v)} /><TextField error={errors.city} label="City" metaKey="city" value={form.city} onChange={(v) => update("city", v)} /><TextField error={errors.zipCode} label="ZIP Code" metaKey="zip_code" value={form.zipCode} onChange={(v) => update("zipCode", v)} /><TextField error={errors.streetAddress} label="Street Address" metaKey="street_address" value={form.streetAddress} onChange={(v) => update("streetAddress", v)} /></div></FormSection>
    <FormSection title="Social Links"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{(["facebook", "instagram", "linkedin", "youtube"] as const).map((key) => <TextField error={errors[key]} key={key} label={key[0].toUpperCase() + key.slice(1)} metaKey={key} type="url" value={form[key]} onChange={(v) => update(key, v)} />)}</div></FormSection>
    <FormSection title="Preferences"><div className="flex flex-wrap gap-x-8 gap-y-4"><CheckboxField checked={form.receiveNotifications} label="Receive Email Notifications" name="email_notifications" onChange={(v) => update("receiveNotifications", v)} /><CheckboxField checked={form.marketingEmails} label="Receive Marketing Emails" name="marketing_emails" onChange={(v) => update("marketingEmails", v)} /><CheckboxField checked={form.publicPhone} label="Display Phone Number Publicly" name="phone_number_public" onChange={(v) => update("publicPhone", v)} /></div></FormSection>
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e8ebef] pt-6 sm:flex-row"><button className="h-11 rounded-lg bg-[#eef1f5] px-6 text-sm font-semibold text-[#172236] disabled:opacity-50" disabled={!dirty || saving} onClick={cancel} type="button">Cancel</button><button className="h-11 rounded-lg bg-[#0864ff] px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" disabled={!dirty || saving} type="submit">{saving ? "Saving..." : "Save Changes"}</button></div>
  </form>;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-9 border-t border-[#edf0f4] pt-7 first:border-t-0"><h2 className="mb-5 text-lg font-bold text-[#0b1426]">{title}</h2>{children}</section>; }
function TextField({ label, metaKey, value, onChange, type = "text", error, disabled = false }: { label: string; metaKey: string; value: string; onChange: (value: string) => void; type?: string; error?: string; disabled?: boolean }) { return <label className="text-sm font-semibold text-[#172236]">{label}<input className={inputClass} disabled={disabled} name={metaKey} type={type} value={value} onChange={(e) => onChange(e.target.value)} />{error ? <span className="mt-1.5 block text-xs text-red-600">{error}</span> : null}</label>; }
function SelectField({ value, onChange }: { value: BusinessType; onChange: (value: BusinessType) => void }) { return <label className="text-sm font-semibold text-[#172236]">Business Type<select className={inputClass} name="business_type" value={value} onChange={(e) => onChange(e.target.value as BusinessType)}>{businessTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>; }
function CheckboxField({ label, name, checked, onChange }: { label: string; name: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="flex items-center gap-3 text-sm font-medium text-[#33445c]"><input checked={checked} className="size-5 rounded accent-[#0864ff]" name={name} type="checkbox" onChange={(e) => onChange(e.target.checked)} />{label}</label>; }
