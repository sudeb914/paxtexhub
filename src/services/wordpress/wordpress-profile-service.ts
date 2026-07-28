import "server-only";
import type { BusinessType, SellerProfileResponse } from "@/types/seller-profile";

const META_KEYS = ["phone", "company_name", "business_type", "website", "bio", "country", "city", "zip_code", "street_address", "facebook", "instagram", "linkedin", "youtube", "email_notifications", "marketing_emails", "phone_number_public", "profile_picture"] as const;

type UnknownRecord = Record<string, unknown>;

export class WordPressProfileError extends Error {
  constructor(public readonly status: number, message: string, public readonly fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "WordPressProfileError";
  }
}

function baseUrl() {
  const value = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!value) throw new WordPressProfileError(500, "WORDPRESS_URL is not configured.");
  return value;
}

function string(value: unknown) { return typeof value === "string" ? value : ""; }
function yes(value: unknown) { return value === "yes" || value === true || value === "1" || value === 1; }
function mediaId(value: unknown) {
  const parsed = typeof value === "number" ? value : typeof value === "string" && /^\d+$/.test(value) ? Number(value) : 0;
  return parsed > 0 ? parsed : null;
}

async function errorFrom(response: Response) {
  let message = "WordPress could not save the profile.";
  try {
    const body = await response.json() as UnknownRecord;
    if (typeof body.message === "string") message = body.message.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  } catch { /* WordPress or a proxy may return non-JSON. */ }
  const status = response.status === 401 ? 401 : response.status === 403 ? 403 : response.status >= 500 ? 502 : 400;
  return new WordPressProfileError(status, message);
}

async function resolvePhoto(token: string, id: number | null, directUrl: unknown) {
  if (typeof directUrl === "string" && directUrl.startsWith("http")) return directUrl;
  if (!id) return null;
  try {
    const response = await fetch(`${baseUrl()}/wp-json/wp/v2/media/${id}?context=view`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(15_000) });
    if (!response.ok) return null;
    const media = await response.json() as UnknownRecord;
    return typeof media.source_url === "string" ? media.source_url : null;
  } catch { return null; }
}

async function normalize(token: string, data: UnknownRecord): Promise<SellerProfileResponse> {
  const meta = data.meta && typeof data.meta === "object" ? data.meta as UnknownRecord : data;
  const photoValue = meta.profile_picture ?? data.profile_picture ?? meta.profile_photo ?? data.profilePhotoId;
  const photoId = mediaId(photoValue);
  const businessType = string(meta.business_type ?? data.businessType);
  return {
    id: typeof data.id === "number" ? data.id : 0,
    firstName: string(data.first_name ?? data.firstName), lastName: string(data.last_name ?? data.lastName),
    displayName: string(data.name ?? data.display_name ?? data.displayName), username: string(data.username), email: string(data.email),
    phone: string(meta.phone ?? data.phone), companyName: string(meta.company_name ?? data.companyName),
    businessType: (["car-dealer", "dealership", "broker"].includes(businessType) ? businessType : "") as BusinessType,
    website: string(meta.website ?? data.website ?? data.url), bio: string(meta.bio ?? data.bio ?? data.description),
    country: string(meta.country ?? data.country), city: string(meta.city ?? data.city), zipCode: string(meta.zip_code ?? data.zipCode), streetAddress: string(meta.street_address ?? data.streetAddress),
    facebook: string(meta.facebook ?? data.facebook), instagram: string(meta.instagram ?? data.instagram), linkedin: string(meta.linkedin ?? data.linkedin), youtube: string(meta.youtube ?? data.youtube),
    receiveNotifications: yes(meta.email_notifications ?? data.emailNotifications), marketingEmails: yes(meta.marketing_emails ?? data.marketingEmails), publicPhone: yes(meta.phone_number_public ?? data.phoneNumberPublic),
    profilePhotoId: photoId, profileImage: await resolvePhoto(token, photoId, data.profilePictureUrl ?? data.profilePhotoUrl),
  };
}

async function request(token: string, url: string, init?: RequestInit) {
  try {
    return await fetch(url, { ...init, headers: { Accept: "application/json", Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) }, cache: "no-store", signal: AbortSignal.timeout(20_000) });
  } catch (error) {
    console.error("Unable to reach the WordPress profile endpoint", error);
    throw new WordPressProfileError(503, "Unable to reach WordPress. Please try again.");
  }
}

export async function getWordPressProfile(token: string) {
  const custom = await request(token, `${baseUrl()}/wp-json/partexhub/v1/profile`);
  if (custom.ok) return normalize(token, await custom.json() as UnknownRecord);
  if (custom.status !== 404) throw await errorFrom(custom);
  const fallback = await request(token, `${baseUrl()}/wp-json/wp/v2/users/me?context=edit`);
  if (!fallback.ok) throw await errorFrom(fallback);
  return normalize(token, await fallback.json() as UnknownRecord);
}

export interface ProfileUpdateInput {
  firstName: string; lastName: string; displayName: string; email: string; phone: string; companyName: string;
  businessType: BusinessType; website: string; bio: string; country: string; city: string; zipCode: string; streetAddress: string;
  facebook: string; instagram: string; linkedin: string; youtube: string; receiveNotifications: boolean; marketingEmails: boolean;
  publicPhone: boolean; profilePhotoId: number | null;
}

export async function updateWordPressProfile(token: string, input: ProfileUpdateInput) {
  const customPayload = { first_name: input.firstName, last_name: input.lastName, display_name: input.displayName, email: input.email, phone: input.phone, company_name: input.companyName, business_type: input.businessType, website: input.website, bio: input.bio, country: input.country, city: input.city, zip_code: input.zipCode, street_address: input.streetAddress, facebook: input.facebook, instagram: input.instagram, linkedin: input.linkedin, youtube: input.youtube, email_notifications: input.receiveNotifications ? "yes" : "no", marketing_emails: input.marketingEmails ? "yes" : "no", phone_number_public: input.publicPhone ? "yes" : "no", profile_picture: input.profilePhotoId ?? "" };
  const custom = await request(token, `${baseUrl()}/wp-json/partexhub/v1/profile`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(customPayload) });
  if (custom.ok) return normalize(token, await custom.json() as UnknownRecord);
  if (custom.status !== 404) throw await errorFrom(custom);

  const meta: UnknownRecord = {};
  for (const key of META_KEYS) if (key !== "phone") meta[key] = customPayload[key];
  const fallback = await request(token, `${baseUrl()}/wp-json/wp/v2/users/me`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ first_name: input.firstName, last_name: input.lastName, name: input.displayName, email: input.email, meta }) });
  if (!fallback.ok) throw await errorFrom(fallback);
  return normalize(token, await fallback.json() as UnknownRecord);
}
