import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getAuthenticatedWordPressUser } from "@/services/wordpress/wordpress-auth-service";
import { getWordPressProfile } from "@/services/wordpress/wordpress-profile-service";
import { calculateProfileCompletion } from "@/lib/profile-completion";
import type { SellerProfileResponse } from "@/types/seller-profile";

export const dynamic = "force-dynamic";

export default async function DashboardRouteGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) redirect("/login");
  let user;
  let profile: SellerProfileResponse | null = null;
  try {
    const [authenticatedUser, sellerProfile] = await Promise.all([
      getAuthenticatedWordPressUser(token),
      getWordPressProfile(token).catch(() => null),
    ]);
    user = authenticatedUser;
    profile = sellerProfile;
  } catch {
    redirect("/login");
  }
  const seller = {
    displayName: user.displayName || "Seller",
    role: user.role,
    email: user.email,
    profileImage: profile?.profileImage ?? null,
    profileCompletion: calculateProfileCompletion(profile),
  };
  return <DashboardLayout seller={seller}>{children}</DashboardLayout>;
}
