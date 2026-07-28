export type BusinessType = "" | "car-dealer" | "dealership" | "broker";

export interface SellerProfileData {
  firstName: string; lastName: string; displayName: string; username: string; email: string; phone: string;
  companyName: string; businessType: BusinessType; website: string; bio: string;
  country: string; city: string; zipCode: string; streetAddress: string;
  facebook: string; instagram: string; linkedin: string; youtube: string;
  receiveNotifications: boolean; marketingEmails: boolean; publicPhone: boolean; profileImage: string | null;
}

export interface SellerProfileResponse extends SellerProfileData {
  id: number;
  profilePhotoId: number | null;
}

export interface SellerProfileUpdateResponse {
  success: true;
  profile: SellerProfileResponse;
}
