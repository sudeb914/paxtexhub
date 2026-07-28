import type { SellerProfileData } from "@/types/seller-profile";

export const dummySellerProfile: SellerProfileData = {
  firstName: "John", lastName: "Smith", displayName: "John Smith", username: "johnsmith", email: "john@example.com", phone: "+1 (555) 123-4567",
  companyName: "AutoHub Motors", businessType: "car-dealer", website: "https://autohub.com", bio: "Professional car dealer with over 10 years of experience specializing in luxury and certified pre-owned vehicles.",
  country: "United States", city: "Los Angeles", zipCode: "90001", streetAddress: "123 Main Street",
  facebook: "", instagram: "", linkedin: "", youtube: "",
  receiveNotifications: true, marketingEmails: false, publicPhone: true, profileImage: null,
};
