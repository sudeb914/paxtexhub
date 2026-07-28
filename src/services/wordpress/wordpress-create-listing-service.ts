import "server-only";
import type { CreateListingInput, CreateListingMedia, CreatedListing } from "@/types/create-listing";

interface WordPressLocationTerm {
  id?: unknown;
  name?: unknown;
}

interface WordPressCreatedPost {
  id?: unknown;
  slug?: unknown;
  status?: unknown;
  title?: { rendered?: unknown; raw?: unknown };
}

interface WordPressErrorBody {
  code?: unknown;
  message?: unknown;
}

export class WordPressListingCreateError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "WordPressListingCreateError";
  }
}

function plainText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#039;/gi, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}

async function responseError(response: Response, fallback: string) {
  let body: WordPressErrorBody = {};
  try { body = await response.json() as WordPressErrorBody; } catch { /* WordPress may return an HTML proxy error. */ }
  return plainText(body.message) || fallback;
}

export async function createAuthenticatedWordPressListing(token: string, input: CreateListingInput, media: CreateListingMedia): Promise<CreatedListing> {
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!wordpressUrl) throw new WordPressListingCreateError(500, "WORDPRESS_URL is not configured");
  const headers = { Accept: "application/json", Authorization: `Bearer ${token}` };

  let locationName: string;
  try {
    const locationResponse = await fetch(`${wordpressUrl}/wp-json/wp/v2/location/${input.locationId}?context=view`, { headers, cache: "no-store", signal: AbortSignal.timeout(15_000) });
    if (!locationResponse.ok) throw new WordPressListingCreateError(400, "Please select a valid location.");
    const location = await locationResponse.json() as WordPressLocationTerm;
    if (typeof location.id !== "number" || typeof location.name !== "string") throw new WordPressListingCreateError(400, "Please select a valid location.");
    locationName = location.name;
  } catch (error) {
    if (error instanceof WordPressListingCreateError) throw error;
    throw new WordPressListingCreateError(503, "Unable to verify the selected location.");
  }

  let response: Response;
  try {
    response = await fetch(`${wordpressUrl}/wp-json/wp/v2/car-listing`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        title: input.title,
        content: input.description,
        status: "pending",
        featured_media: media.featuredMediaId,
        meta: {
          model: input.model,
          year: String(input.year),
          price: String(input.price),
          mileage: String(input.mileage),
          location: locationName,
          featured: "false",
          gallery: media.galleryMediaIds.map(String),
        },
        brand: [input.brandId],
        "car-type": [input.carTypeId],
        location: [input.locationId],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    console.error("Unable to reach the WordPress listing creation endpoint", error);
    throw new WordPressListingCreateError(503, "Unable to reach the listing server. Please try again.");
  }

  if (!response.ok) {
    const status = response.status === 401 ? 401 : response.status === 403 ? 403 : response.status >= 500 ? 502 : 400;
    const fallback = status === 403 ? "Your seller account does not have permission to create listings." : "WordPress could not create the listing.";
    throw new WordPressListingCreateError(status, await responseError(response, fallback));
  }

  const post = await response.json() as WordPressCreatedPost;
  const title = typeof post.title?.rendered === "string" ? plainText(post.title.rendered) : typeof post.title?.raw === "string" ? post.title.raw : input.title;
  if (typeof post.id !== "number" || typeof post.slug !== "string" || post.status !== "pending") throw new WordPressListingCreateError(502, "WordPress returned an invalid listing response.");
  return { id: post.id, title, status: "pending", slug: post.slug };
}
