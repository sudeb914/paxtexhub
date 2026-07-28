import type { SellerProfileData } from "@/types/seller-profile";

export const PROFILE_COMPLETION_FIELDS = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "displayName", label: "Display name" },
  { key: "email", label: "Email address" },
  { key: "phone", label: "Phone number" },
  { key: "businessType", label: "Business type" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "streetAddress", label: "Street address" },
  { key: "profileImage", label: "Profile photo" },
] as const satisfies ReadonlyArray<{ key: keyof SellerProfileData; label: string }>;

export interface ProfileCompletion {
  percentage: number;
  completed: number;
  total: number;
  isComplete: boolean;
  missingFields: string[];
}

export function calculateProfileCompletion(profile: Partial<SellerProfileData> | null | undefined): ProfileCompletion {
  const completed = PROFILE_COMPLETION_FIELDS.filter(({ key }) => {
    const value = profile?.[key];
    return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
  }).length;
  const total = PROFILE_COMPLETION_FIELDS.length;
  return {
    percentage: Math.round((completed / total) * 100),
    completed,
    total,
    isComplete: completed === total,
    missingFields: PROFILE_COMPLETION_FIELDS.filter(({ key }) => {
      const value = profile?.[key];
      return typeof value === "string" ? !value.trim() : !value;
    }).map(({ label }) => label),
  };
}
