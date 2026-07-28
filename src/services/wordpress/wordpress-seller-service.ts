import { adaptWordPressCar } from "@/services/adapters/wordpress-car-adapter";
import { getWordPressJson } from "@/services/wordpress/wordpress-api";
import type { PublicSellerProfile } from "@/types/public-seller";
import type { WordPressCarListing, WordPressMedia, WordPressUser } from "@/types/wordpress";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPublicPhone(value: unknown) {
  return value === true || value === "true" || value === "yes" || value === "1";
}

async function profileImage(user: WordPressUser) {
  const mediaId = Number(user.meta?.profile_picture);
  if (Number.isInteger(mediaId) && mediaId > 0) {
    try {
      const media = await getWordPressJson<WordPressMedia>(`media/${mediaId}`);
      return media.media_details?.sizes?.thumbnail?.source_url ?? media.source_url;
    } catch {
      // Use the public WordPress avatar below when custom media is unavailable.
    }
  }
  return user.avatar_urls?.["96"] ?? null;
}

export async function getPublicSellerBySlug(slug: string): Promise<PublicSellerProfile | null> {
  const users = await getWordPressJson<WordPressUser[]>(`users?slug=${encodeURIComponent(slug)}&context=view`, { cache: "no-store" });
  const user = users[0];
  if (!user) return null;

  const [avatarUrl, posts] = await Promise.all([
    profileImage(user),
    getWordPressJson<WordPressCarListing[]>(`car-listing?author=${user.id}&status=publish&per_page=100&orderby=date&order=desc&_embed=1`),
  ]);
  const meta = user.meta ?? {};
  const city = text(meta.city);
  const country = text(meta.country);
  const socialLinks = [
    { label: "Facebook", url: text(meta.facebook) },
    { label: "Instagram", url: text(meta.instagram) },
    { label: "LinkedIn", url: text(meta.linkedin) },
    { label: "YouTube", url: text(meta.youtube) },
  ].filter((item) => item.url);
  const publicPhone = text(user.partexhub_public_phone) || (isPublicPhone(meta.phone_number_public) ? text(meta.phone_number ?? meta.phone) : "");

  return {
    id: user.id,
    slug: user.slug,
    displayName: text(user.name) || "AutoHub Seller",
    avatarUrl,
    companyName: text(meta.company_name),
    businessType: text(meta.business_type),
    bio: text(meta.bio) || text(user.description),
    location: [city, country].filter(Boolean).join(", "),
    website: text(meta.website) || text(user.url),
    phone: text(user.partexhub_phone_display) || publicPhone,
    phoneIsPublic: Boolean(publicPhone),
    socialLinks,
    cars: posts.map(adaptWordPressCar),
  };
}
