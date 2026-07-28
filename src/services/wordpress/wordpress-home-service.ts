import { adaptWordPressCar, isFeaturedWordPressCar } from "@/services/adapters/wordpress-car-adapter";
import { getWordPressTaxonomies, wordpressFetch } from "@/services/wordpress/wordpress-api";
import type { Car } from "@/types/car";
import type { TaxonomyOption, WordPressCarListing } from "@/types/wordpress";

export interface WordPressHomeData {
  featuredCars: Car[];
  brands: TaxonomyOption[];
  carTypes: TaxonomyOption[];
  locations: TaxonomyOption[];
}

export async function getWordPressHomeData(): Promise<WordPressHomeData> {
  const [postsResult, taxonomiesResult] = await Promise.allSettled([
    wordpressFetch("car-listing?per_page=100&status=publish&orderby=date&order=desc&_embed=1", { cache: "no-store" }).then((response) => response.json() as Promise<WordPressCarListing[]>),
    getWordPressTaxonomies(),
  ]);
  const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
  const taxonomies = taxonomiesResult.status === "fulfilled" ? taxonomiesResult.value : { brands: [], carTypes: [], locations: [] };

  if (postsResult.status === "rejected") console.error("Unable to load featured WordPress cars", postsResult.reason);
  if (taxonomiesResult.status === "rejected") console.error("Unable to load WordPress home taxonomies", taxonomiesResult.reason);

  return {
    featuredCars: posts.filter(isFeaturedWordPressCar).map(adaptWordPressCar),
    brands: taxonomies.brands,
    carTypes: taxonomies.carTypes,
    locations: taxonomies.locations,
  };
}
