import { adaptWordPressCar, isFeaturedWordPressCar } from "@/services/adapters/wordpress-car-adapter";
import { getWordPressJson, getWordPressTaxonomies } from "@/services/wordpress/wordpress-api";
import type { Car } from "@/types/car";
import type { TaxonomyOption, WordPressCarListing } from "@/types/wordpress";

export interface WordPressHomeData {
  featuredCars: Car[];
  brands: TaxonomyOption[];
  carTypes: TaxonomyOption[];
  locations: TaxonomyOption[];
}

export async function getWordPressHomeData(): Promise<WordPressHomeData> {
  const [posts, taxonomies] = await Promise.all([
    getWordPressJson<WordPressCarListing[]>("car-listing?per_page=100&_embed=1"),
    getWordPressTaxonomies(),
  ]);

  return {
    featuredCars: posts.filter(isFeaturedWordPressCar).map(adaptWordPressCar),
    brands: taxonomies.brands,
    carTypes: taxonomies.carTypes,
    locations: taxonomies.locations,
  };
}
