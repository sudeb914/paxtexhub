import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthenticatedWordPressUser, WordPressAuthError } from "@/services/wordpress/wordpress-auth-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const user = await getAuthenticatedWordPressUser(token);
    return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof WordPressAuthError && error.status === 401) {
      const response = NextResponse.json({ error: "Your session is invalid or expired" }, { status: 401 });
      response.cookies.set("partexhub_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    console.error("Current-user request failed", error);
    const status = error instanceof WordPressAuthError ? error.status : 500;
    return NextResponse.json({ error: "Unable to load your account. Please try again." }, { status });
  }
}
