import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedWordPressUser, WordPressAuthError } from "@/services/wordpress/wordpress-auth-service";

export const dynamic = "force-dynamic";

const schema = z.object({
  currentPassword: z.string().min(1, "Enter your current password.").max(256),
  newPassword: z.string().min(8, "Password must be at least 8 characters.").max(256)
    .regex(/[a-z]/, "Include at least one lowercase letter.")
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/\d/, "Include at least one number."),
  confirmPassword: z.string().min(1, "Confirm your new password.").max(256),
}).strict().refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.", path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "Choose a password different from your current password.", path: ["newPassword"],
});

function cleanMessage(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
}

function clearSession(response: NextResponse) {
  response.cookies.set("partexhub_token", "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(0), maxAge: 0,
  });
  return response;
}

export async function POST(request: Request) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) if (!fieldErrors[String(issue.path[0])]) fieldErrors[String(issue.path[0])] = issue.message;
    return NextResponse.json({ error: "Please correct the highlighted fields.", fieldErrors }, { status: 400 });
  }

  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!wordpressUrl) return NextResponse.json({ error: "Password changes are temporarily unavailable." }, { status: 500 });

  try {
    const user = await getAuthenticatedWordPressUser(token);
    const verification = await fetch(`${wordpressUrl}/wp-json/jwt-auth/v1/token`, {
      method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, password: parsed.data.currentPassword }), cache: "no-store", signal: AbortSignal.timeout(15_000),
    });
    if (!verification.ok) return NextResponse.json({ error: "Your current password is incorrect.", fieldErrors: { currentPassword: "Your current password is incorrect." } }, { status: 400 });

    const update = await fetch(`${wordpressUrl}/wp-json/wp/v2/users/me`, {
      method: "POST", headers: { Accept: "application/json", Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ password: parsed.data.newPassword }), cache: "no-store", signal: AbortSignal.timeout(15_000),
    });
    if (!update.ok) {
      const body = await update.json().catch(() => ({})) as { message?: unknown };
      const message = cleanMessage(body.message);
      return NextResponse.json({ error: message || "WordPress could not update your password." }, { status: update.status === 401 || update.status === 403 ? 403 : 502 });
    }

    return clearSession(NextResponse.json({ success: true }));
  } catch (error) {
    if (error instanceof WordPressAuthError && error.status === 401) return clearSession(NextResponse.json({ error: "Your session has expired." }, { status: 401 }));
    console.error("Password change request failed without exposing credentials", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({ error: "Unable to change your password. Please try again." }, { status: 503 });
  }
}
