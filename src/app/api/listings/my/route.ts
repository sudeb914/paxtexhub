import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAuthenticatedWordPressUser, WordPressAuthError } from "@/services/wordpress/wordpress-auth-service";
import { getAuthenticatedSellerListings } from "@/services/wordpress/wordpress-my-listings-service";

export const dynamic = "force-dynamic";

function unauthorizedResponse(message = "Authentication required") {
  const response = NextResponse.json({ error: message }, { status: 401 });
  response.cookies.set("partexhub_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return unauthorizedResponse();

  try {
    const user = await getAuthenticatedWordPressUser(token);
    const result = await getAuthenticatedSellerListings(token, user.id);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof WordPressAuthError && error.status === 401) return unauthorizedResponse("Your session is invalid or expired");
    console.error("Seller listings request failed", error);
    const status = error instanceof WordPressAuthError ? error.status : 500;
    return NextResponse.json({ error: "Unable to load your listings. Please try again." }, { status });
  }
}
