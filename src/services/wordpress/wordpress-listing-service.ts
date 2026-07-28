import { adaptWordPressCar } from "@/services/adapters/wordpress-car-adapter";
import { getWordPressJson, getWordPressTaxonomies, wordpressFetch } from "@/services/wordpress/wordpress-api";
import type { PaginatedResult } from "@/types/api";
import type { Car } from "@/types/car";
import type { WordPressCarListing } from "@/types/wordpress";

const PAGE_SIZE = 8;

export interface WordPressListingFilters {
  brand?: string;
  carType?: string;
  location?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
}

function addTaxonomyFilters(params: URLSearchParams, filters: WordPressListingFilters) {
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.carType) params.set("car-type", filters.carType);
  if (filters.location) params.set("location", filters.location);
}

async function getPriceSortedCars(filters: WordPressListingFilters): Promise<PaginatedResult<Car>> {
  const params = new URLSearchParams({ per_page: "100", _embed: "1" });
  addTaxonomyFilters(params, filters);
  const posts = await getWordPressJson<WordPressCarListing[]>(`car-listing?${params.toString()}`);
  const sorted = posts.map(adaptWordPressCar).sort((a, b) => filters.sort === "price-asc" ? a.price - b.price : b.price - a.price);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  return { items: sorted.slice(start, start + PAGE_SIZE), page, pageSize: PAGE_SIZE, totalItems: sorted.length, totalPages };
}

export async function getWordPressCars(filters: WordPressListingFilters): Promise<PaginatedResult<Car>> {
  if (filters.sort === "price-asc" || filters.sort === "price-desc") return getPriceSortedCars(filters);

  const page = Math.max(1, filters.page ?? 1);
  const params = new URLSearchParams({ per_page: String(PAGE_SIZE), page: String(page), _embed: "1", orderby: "date", order: "desc" });
  addTaxonomyFilters(params, filters);
  const response = await wordpressFetch(`car-listing?${params.toString()}`);
  const posts = await response.json() as WordPressCarListing[];
  const totalItems = Number(response.headers.get("X-WP-Total")) || posts.length;
  const totalPages = Number(response.headers.get("X-WP-TotalPages")) || 1;
  return { items: posts.map(adaptWordPressCar), page, pageSize: PAGE_SIZE, totalItems, totalPages };
}

export async function getWordPressListingData(filters: WordPressListingFilters) {
  const [result, taxonomies] = await Promise.all([getWordPressCars(filters), getWordPressTaxonomies()]);
  return { result, ...taxonomies };
}
