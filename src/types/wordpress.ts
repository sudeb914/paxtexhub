export interface WordPressRendered {
  rendered: string;
  raw?: string;
}

export interface WordPressTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: "brand" | "car-type" | "location" | string;
}

export interface WordPressMedia {
  id: number;
  author?: number;
  alt_text: string;
  source_url: string;
  media_details?: {
    sizes?: Record<string, { source_url: string }>;
  };
}

export interface WordPressUser {
  id: number;
  name: string;
  link: string;
  slug: string;
  description?: string;
  url?: string;
  avatar_urls?: Record<string, string>;
  meta?: {
    profile_picture?: string | number;
    company_name?: string;
    business_type?: string;
    bio?: string;
    country?: string;
    city?: string;
    website?: string;
    phone?: string;
    phone_number_public?: string | boolean;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface WordPressCarListing {
  id: number;
  date: string;
  slug: string;
  status: "publish" | "pending" | "draft" | string;
  link: string;
  title: WordPressRendered;
  content: WordPressRendered;
  author: number;
  featured_media: number;
  meta: {
    featured?: string | boolean;
    model?: string;
    year?: string;
    price?: string;
    mileage?: string;
    location?: string;
    gallery?: Array<number | string>;
  };
  brand?: number[];
  "car-type"?: number[];
  location?: number[];
  _embedded?: {
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: WordPressTerm[][];
  };
}

export interface WordPressTaxonomyTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
}

export interface TaxonomyOption {
  id: number;
  name: string;
  slug: string;
  count: number;
}
