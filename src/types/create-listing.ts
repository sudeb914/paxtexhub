export interface CreateListingInput {
  title: string;
  description: string;
  brandId: number;
  carTypeId: number;
  locationId: number;
  model: string;
  year: number;
  price: number;
  mileage: number;
}

export interface CreateListingMedia {
  featuredMediaId: number;
  galleryMediaIds: number[];
}

export interface CreatedListing {
  id: number;
  title: string;
  status: "publish" | "pending" | "draft";
  slug: string;
}

export interface CreateListingResponse {
  success: true;
  listing: CreatedListing;
}
