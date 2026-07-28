import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const token = (await cookies()).get("partexhub_token")?.value;
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");

  if (token && wordpressUrl) {
    try {
      const response = await fetch(`${wordpressUrl}/wp-json/partexhub/v1/token/revoke`, {
        method: "POST",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) console.warn("WordPress JWT revocation did not succeed; the local session was still cleared.");
    } catch {
      console.warn("WordPress JWT revocation was unavailable; the local session was still cleared.");
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("partexhub_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
