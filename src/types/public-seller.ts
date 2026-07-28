import type { Car } from "@/types/car";

export interface PublicSellerProfile {
  id: number;
  slug: string;
  displayName: string;
  avatarUrl: string | null;
  companyName: string;
  businessType: string;
  bio: string;
  location: string;
  website: string;
  phone: string;
  socialLinks: Array<{ label: string; url: string }>;
  cars: Car[];
}
