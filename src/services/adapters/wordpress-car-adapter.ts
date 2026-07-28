import type { Car } from "@/types/car";
import type { WordPressCarListing, WordPressTerm } from "@/types/wordpress";

function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&#038;/g, "&").replace(/\s+/g, " ").trim();
}

function findTerm(post: WordPressCarListing, taxonomy: string): WordPressTerm | undefined {
  return post._embedded?.["wp:term"]?.flat().find((term) => term.taxonomy === taxonomy);
}

export function isFeaturedWordPressCar(post: WordPressCarListing) {
  const value = post.meta?.featured;
  return value === true || value === "true" || value === "1";
}

export function adaptWordPressCar(post: WordPressCarListing): Car {
  const brand = findTerm(post, "brand");
  const bodyType = findTerm(post, "car-type");
  const locationTerm = findTerm(post, "location");
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = media?.media_details?.sizes?.large?.source_url ?? media?.source_url ?? "/images/cars/toyota-camry.jpg";
  const title = plainText(post.title.rendered);

  return {
    id: String(post.id),
    slug: post.slug,
    title,
    price: Number(post.meta?.price) || 0,
    currency: "BDT",
    year: Number(post.meta?.year) || 0,
    make: brand?.name ?? "Unknown",
    model: post.meta?.model ?? "",
    mileage: Number(post.meta?.mileage) || 0,
    location: post.meta?.location ?? locationTerm?.name ?? "Bangladesh",
    categoryId: bodyType?.slug ?? "car",
    fuelType: "Not specified",
    transmission: "Not specified",
    description: plainText(post.content.rendered),
    status: "active",
    images: [{ id: String(media?.id ?? post.featured_media), url: imageUrl, alt: media?.alt_text || title }],
    sellerId: "wordpress",
    createdAt: post.date,
    sourceUrl: post.link,
  };
}
