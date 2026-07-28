import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedWordPressUser } from "@/services/wordpress/wordpress-auth-service";

export const dynamic = "force-dynamic";

export default async function DashboardRouteGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) redirect("/login");
  try {
    await getAuthenticatedWordPressUser(token);
  } catch {
    redirect("/login");
  }
  return children;
}
