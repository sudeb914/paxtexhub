export type SellerListingStatus = "publish" | "pending" | "draft";

export interface SellerListing {
  id: number;
  slug: string;
  title: string;
  featuredImage: string;
  imageAlt: string;
  price: number;
  currency: "USD" | "BDT";
  status: SellerListingStatus;
  createdAt: string;
  editUrl: string;
  publicUrl: string;
}

export interface MyListingsResponse {
  listings: SellerListing[];
  total: number;
  totalPages: number;
}
