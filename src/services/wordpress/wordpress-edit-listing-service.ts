import "server-only";
import type { CreateListingInput, CreateListingMedia, CreatedListing } from "@/types/create-listing";
import type { EditableSellerListing, ListingMediaReference } from "@/types/edit-listing";
import type { WordPressCarListing, WordPressMedia } from "@/types/wordpress";
import { WordPressListingCreateError } from "@/services/wordpress/wordpress-create-listing-service";

function plainText(html: string) { return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&#038;|&amp;/gi, "&").replace(/&#039;/gi, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim(); }
function mediaReference(media: WordPressMedia): ListingMediaReference { return { id: media.id, url: media.media_details?.sizes?.large?.source_url ?? media.source_url, alt: media.alt_text || "Car image" }; }

async function requestError(response: Response, fallback: string) {
  try { const body = await response.json() as { message?: unknown }; return typeof body.message === "string" ? plainText(body.message) : fallback; } catch { return fallback; }
}

async function getOwnedPost(token: string, userId: number, listingId: number) {
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!wordpressUrl) throw new WordPressListingCreateError(500, "WORDPRESS_URL is not configured");
  let response = await fetch(`${wordpressUrl}/wp-json/wp/v2/car-listing/${listingId}?context=edit&_embed=wp:featuredmedia`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  // Authors without edit_published_posts can still load their own public listing
  // through view context. Ownership is always checked below.
  if (response.status === 403) {
    response = await fetch(`${wordpressUrl}/wp-json/wp/v2/car-listing/${listingId}?context=view&_embed=wp:featuredmedia`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  }
  if (!response.ok) {
    const status = response.status === 404 ? 404 : response.status === 401 ? 401 : response.status === 403 ? 403 : 502;
    throw new WordPressListingCreateError(status, await requestError(response, status === 404 ? "Listing not found." : "Unable to load this listing."));
  }
  const post = await response.json() as WordPressCarListing;
  if (post.author !== userId) throw new WordPressListingCreateError(403, "You can only edit your own listings.");
  return post;
}

export async function getOwnedWordPressListing(token: string, userId: number, listingId: number): Promise<EditableSellerListing> {
  const post = await getOwnedPost(token, userId, listingId);
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  const galleryIds = (post.meta?.gallery ?? []).map(Number).filter((id) => Number.isInteger(id) && id > 0);
  let galleryImages: ListingMediaReference[] = [];
  if (galleryIds.length) {
    const params = new URLSearchParams({ include: galleryIds.join(","), per_page: String(galleryIds.length), context: "view" });
    const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/media?${params}`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (response.ok) galleryImages = ((await response.json()) as WordPressMedia[]).map(mediaReference);
  }
  const featured = post._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: post.id, slug: post.slug, status: post.status,
    title: post.title.raw ?? plainText(post.title.rendered),
    description: post.content.raw ?? plainText(post.content.rendered),
    brandId: post.brand?.[0] ?? 0, carTypeId: post["car-type"]?.[0] ?? 0, locationId: post.location?.[0] ?? 0,
    model: post.meta?.model ?? "", year: Number(post.meta?.year) || 0, price: Number(post.meta?.price) || 0, mileage: Number(post.meta?.mileage) || 0,
    featuredImage: featured ? mediaReference(featured) : null, galleryImages,
  };
}

export async function updateOwnedWordPressListing(token: string, userId: number, listingId: number, input: CreateListingInput, media: CreateListingMedia): Promise<CreatedListing> {
  const existing = await getOwnedPost(token, userId, listingId);
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  const locationResponse = await fetch(`${wordpressUrl}/wp-json/wp/v2/location/${input.locationId}?context=view`, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!locationResponse.ok) throw new WordPressListingCreateError(400, "Please select a valid location.");
  const location = await locationResponse.json() as { name?: unknown };
  if (typeof location.name !== "string") throw new WordPressListingCreateError(400, "Please select a valid location.");
  const payload = { title: input.title, content: input.description, status: "pending", featured_media: media.featuredMediaId, meta: { ...existing.meta, model: input.model, year: String(input.year), price: String(input.price), mileage: String(input.mileage), location: location.name, gallery: media.galleryMediaIds.map(String) }, brand: [input.brandId], "car-type": [input.carTypeId], location: [input.locationId] };
  let response = await fetch(`${wordpressUrl}/wp-json/wp/v2/car-listing/${listingId}`, {
    method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, cache: "no-store",
    body: JSON.stringify(payload),
  });
  // WordPress core blocks authors without edit_published_posts before it sees
  // the pending transition. The companion endpoint performs a strict author
  // check and only permits this one safe transition for car listings.
  if (response.status === 403) {
    response = await fetch(`${wordpressUrl}/wp-json/partexhub/v1/listings/${listingId}`, {
      method: "PUT", headers: { Accept: "application/json", Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, cache: "no-store",
      body: JSON.stringify(payload), signal: AbortSignal.timeout(20_000),
    });
    if (response.status === 404) throw new WordPressListingCreateError(503, "The PartexHub profile API plugin must be updated and activated before published listings can be edited.");
  }
  if (!response.ok) { const status = response.status === 401 ? 401 : response.status === 403 ? 403 : response.status >= 500 ? 502 : 400; throw new WordPressListingCreateError(status, await requestError(response, "WordPress could not update the listing.")); }
  const post = await response.json() as WordPressCarListing;
  if (post.status !== "pending") throw new WordPressListingCreateError(502, "WordPress did not move the edited listing to pending review.");
  return { id: post.id, title: plainText(post.title.rendered), status: "pending", slug: post.slug };
}

export async function trashOwnedWordPressListing(token: string, userId: number, listingId: number) {
  await getOwnedPost(token, userId, listingId);
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/car-listing/${listingId}?force=false`, {
    method: "DELETE",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    const status = response.status === 401 ? 401 : response.status === 403 ? 403 : response.status === 404 ? 404 : response.status >= 500 ? 502 : 400;
    throw new WordPressListingCreateError(status, await requestError(response, "WordPress could not move this listing to Trash."));
  }
  const post = await response.json() as WordPressCarListing;
  if (post.status !== "trash") throw new WordPressListingCreateError(502, "WordPress did not confirm that the listing was trashed.");
  return { id: post.id, status: "trash" as const };
}
