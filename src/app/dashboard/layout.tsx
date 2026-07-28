import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getAuthenticatedWordPressUser } from "@/services/wordpress/wordpress-auth-service";

export const dynamic = "force-dynamic";

export default async function DashboardRouteGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) redirect("/login");
  let user;
  try {
    user = await getAuthenticatedWordPressUser(token);
  } catch {
    redirect("/login");
  }
  const seller = {
    username: user.displayName || user.username,
    role: user.role,
    email: user.email,
    profileImage: null,
  };
  return <DashboardLayout seller={seller}>{children}</DashboardLayout>;
}
