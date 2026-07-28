import type { CreateListingInput } from "@/types/create-listing";

export interface ListingMediaReference { id: number; url: string; alt: string }

export interface EditableSellerListing extends CreateListingInput {
  id: number;
  slug: string;
  status: string;
  featuredImage: ListingMediaReference | null;
  galleryImages: ListingMediaReference[];
}
