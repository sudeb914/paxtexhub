import type { TaxonomyOption, WordPressTaxonomyTerm } from "@/types/wordpress";

const API_ROOT = (process.env.WORDPRESS_API_ROOT ?? "https://partexhub.com/wp-json/wp/v2").replace(/\/$/, "");

export async function wordpressFetch(path: string, options?: { cache?: RequestCache }) {
  const response = await fetch(`${API_ROOT}/${path}`, {
    headers: { Accept: "application/json" },
    ...(options?.cache === "no-store" ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
  });
  if (!response.ok) throw new Error(`WordPress request failed with ${response.status}`);
  return response;
}

export async function getWordPressJson<T>(path: string): Promise<T> {
  const response = await wordpressFetch(path);
  return response.json() as Promise<T>;
}

function toOptions(terms: WordPressTaxonomyTerm[]): TaxonomyOption[] {
  return terms.map(({ id, name, slug, count }) => ({ id, name, slug, count }));
}

export async function getWordPressTaxonomies() {
  const [brands, carTypes, locations] = await Promise.all([
    getWordPressJson<WordPressTaxonomyTerm[]>("brand?per_page=100&hide_empty=false"),
    getWordPressJson<WordPressTaxonomyTerm[]>("car-type?per_page=100&hide_empty=false"),
    getWordPressJson<WordPressTaxonomyTerm[]>("location?per_page=100&hide_empty=false"),
  ]);
  return { brands: toOptions(brands), carTypes: toOptions(carTypes), locations: toOptions(locations) };
}

export async function getWordPressCarTypeBySlug(slug: string) {
  const terms = await getWordPressJson<WordPressTaxonomyTerm[]>(`car-type?slug=${encodeURIComponent(slug)}`);
  return terms[0] ?? null;
}
