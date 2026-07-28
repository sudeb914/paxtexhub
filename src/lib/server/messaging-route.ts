import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MessagingApiError, wordpressMessagingRequest } from "@/services/wordpress/wordpress-messaging-service";

export async function messagingRoute<T>(path: string, init?: RequestInit) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  try {
    const data = await wordpressMessagingRequest<T>(token, path, init);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof MessagingApiError ? error.status : 500;
    const safeStatus = status >= 400 && status < 600 ? status : 500;
    return NextResponse.json({ message: error instanceof MessagingApiError ? error.message : "Unable to complete the request" }, { status: safeStatus });
  }
}
