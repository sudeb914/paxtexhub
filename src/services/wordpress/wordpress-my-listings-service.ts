import "server-only";
import type { SellerListing, SellerListingStatus } from "@/types/seller-listing";
import type { WordPressCarListing } from "@/types/wordpress";
import { WordPressAuthError } from "@/services/wordpress/wordpress-auth-service";

export interface AuthenticatedListingsResult {
  listings: SellerListing[];
  total: number;
  totalPages: number;
}

function plainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#038;|&amp;/gi, "&")
    .replace(/&#039;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeStatus(status: string): SellerListingStatus {
  if (status === "pending" || status === "draft") return status;
  return "publish";
}

function normalizeListing(post: WordPressCarListing): SellerListing {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const title = plainText(post.title.rendered);

  return {
    id: post.id,
    slug: post.slug,
    title,
    featuredImage: media?.media_details?.sizes?.large?.source_url ?? media?.source_url ?? "/images/cars/toyota-camry.jpg",
    imageAlt: media?.alt_text || title,
    price: Number(post.meta?.price) || 0,
    currency: "BDT",
    status: normalizeStatus(post.status),
    createdAt: post.date,
    editUrl: `/dashboard/listings/${post.id}/edit`,
    publicUrl: `/cars/${post.slug}`,
  };
}

export async function getAuthenticatedSellerListings(token: string, authorId: number): Promise<AuthenticatedListingsResult> {
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!wordpressUrl) throw new WordPressAuthError(500, "WORDPRESS_URL is not configured");

  try {
    const responses = await Promise.all((["publish", "pending", "draft"] as const).map(async (status) => {
      const params = new URLSearchParams({
        author: String(authorId),
        context: status === "publish" ? "view" : "edit",
        status,
        per_page: "100",
        orderby: "date",
        order: "desc",
        _embed: "wp:featuredmedia",
      });
      const response = await fetch(`${wordpressUrl}/wp-json/wp/v2/car-listing?${params.toString()}`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) {
        const isUnauthorized = response.status === 401 || response.status === 403;
        throw new WordPressAuthError(isUnauthorized ? 401 : 502, isUnauthorized ? "Your session is invalid or expired" : "Unable to load seller listings");
      }
      const posts = await response.json() as WordPressCarListing[];
      if (!Array.isArray(posts)) throw new WordPressAuthError(502, "WordPress returned an invalid listings response");
      return {
        posts,
        total: Number(response.headers.get("X-WP-Total")) || posts.length,
        totalPages: Number(response.headers.get("X-WP-TotalPages")) || (posts.length ? 1 : 0),
      };
    }));

    const posts = responses.flatMap((result) => result.posts).sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    return {
      listings: posts.map(normalizeListing),
      total: responses.reduce((total, result) => total + result.total, 0),
      totalPages: Math.max(0, ...responses.map((result) => result.totalPages)),
    };
  } catch (error) {
    if (error instanceof WordPressAuthError) throw error;
    console.error("Unable to reach the WordPress seller listings endpoint", error);
    throw new WordPressAuthError(503, "Unable to reach the listings server");
  }
}
