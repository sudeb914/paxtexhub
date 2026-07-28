import { adaptWordPressCar } from "@/services/adapters/wordpress-car-adapter";
import { getWordPressJson } from "@/services/wordpress/wordpress-api";
import type { Car, CarImage } from "@/types/car";
import type { Seller } from "@/types/user";
import type { WordPressCarListing, WordPressMedia, WordPressUser } from "@/types/wordpress";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPublicPhone(value: unknown) {
  return value === true || value === "true" || value === "yes" || value === "1";
}

function adaptMedia(media: WordPressMedia, fallbackTitle: string): CarImage {
  return {
    id: String(media.id),
    url: media.media_details?.sizes?.large?.source_url ?? media.source_url,
    alt: media.alt_text || fallbackTitle,
  };
}

async function getGallery(post: WordPressCarListing, car: Car): Promise<CarImage[]> {
  const ids = Array.from(new Set([post.featured_media, ...(post.meta?.gallery ?? [])].map(Number))).filter((id) => Number.isInteger(id) && id > 0);
  if (ids.length <= 1) return car.images;
  const media = await getWordPressJson<WordPressMedia[]>(`media?include=${ids.join(",")}&per_page=100`);
  const byId = new Map(media.map((item) => [item.id, item]));
  return ids.map((id) => byId.get(id)).filter((item): item is WordPressMedia => Boolean(item)).map((item) => adaptMedia(item, car.title));
}

async function getSeller(post: WordPressCarListing): Promise<Seller | null> {
  const authorId = Number(post.author);
  if (!authorId) return null;
  try {
    const user = await getWordPressJson<WordPressUser>(`users/${authorId}`);
    const profilePictureId = Number(user.meta?.profile_picture);
    let avatarUrl = user.avatar_urls?.["96"] ?? "";
    if (Number.isInteger(profilePictureId) && profilePictureId > 0) {
      try {
        const profilePicture = await getWordPressJson<WordPressMedia>(`media/${profilePictureId}`);
        avatarUrl = profilePicture.media_details?.sizes?.thumbnail?.source_url ?? profilePicture.source_url;
      } catch {
        // Keep the WordPress avatar as a safe fallback when profile media is unavailable.
      }
    }
    const companyName = user.meta?.company_name?.trim();
    const phone = text(user.partexhub_public_phone) || (isPublicPhone(user.meta?.phone_number_public) ? text(user.meta?.phone_number ?? user.meta?.phone) : "");
    return {
      id: String(user.id),
      name: user.name,
      avatarUrl,
      memberSince: "",
      subtitle: companyName || "Verified WordPress seller",
      phone,
      profileUrl: `/sellers/${user.slug}`,
    };
  } catch {
    return null;
  }
}

export interface WordPressSingleCarData {
  car: Car;
  seller: Seller | null;
}

export async function getWordPressCarBySlug(slug: string): Promise<WordPressSingleCarData | null> {
  const posts = await getWordPressJson<WordPressCarListing[]>(`car-listing?slug=${encodeURIComponent(slug)}&_embed=1`);
  const post = posts[0];
  if (!post) return null;
  const car = adaptWordPressCar(post);
  const [images, seller] = await Promise.all([getGallery(post, car), getSeller(post)]);
  return { car: { ...car, images }, seller };
}
