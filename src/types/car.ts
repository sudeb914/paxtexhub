export type ListingStatus = "active" | "sold" | "pending" | "draft";

export interface CarImage {
  id: string;
  url: string;
  alt: string;
}

export interface Car {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency?: "USD" | "BDT";
  year: number;
  make: string;
  model: string;
  mileage: number;
  location: string;
  categoryId: string;
  fuelType: string;
  transmission: string;
  description: string;
  status: ListingStatus;
  images: CarImage[];
  sellerId: string;
  createdAt: string;
  sourceUrl?: string;
}

export interface CarFilters {
  make?: string;
  model?: string;
  location?: string;
  category?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
}
