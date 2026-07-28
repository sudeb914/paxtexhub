import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name.").max(50, "First name must be 50 characters or fewer.").transform((value) => value.replace(/\s+/g, " ")),
  lastName: z.string().trim().min(1, "Enter your last name.").max(50, "Last name must be 50 characters or fewer.").transform((value) => value.replace(/\s+/g, " ")),
  email: z.string().trim().email("Enter a valid email address.").max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(256).regex(/[A-Za-z]/, "Password must contain at least one letter.").regex(/\d/, "Password must contain at least one number."),
  confirmPassword: z.string().min(1, "Confirm your password.").max(256),
  acceptTerms: z.literal(true, { error: "You must accept the Terms of Service and Privacy Policy." }),
}).strict().refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] });

function plainText(value: unknown) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim() : "";
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) if (!fieldErrors[String(issue.path[0])]) fieldErrors[String(issue.path[0])] = issue.message;
    return NextResponse.json({ success: false, error: "Please correct the highlighted fields.", fieldErrors }, { status: 400 });
  }

  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!wordpressUrl) { console.error("WORDPRESS_URL is not configured for registration"); return NextResponse.json({ success: false, error: "Registration is temporarily unavailable. Please try again later." }, { status: 500 }); }

  try {
    const response = await fetch(`${wordpressUrl}/wp-json/partexhub/v1/register`, {
      method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, cache: "no-store", signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({ first_name: parsed.data.firstName, last_name: parsed.data.lastName, email: parsed.data.email, password: parsed.data.password, confirm_password: parsed.data.confirmPassword, accept_terms: true }),
    });
    const body = await response.json().catch(() => ({})) as { success?: boolean; message?: unknown; user?: { id?: unknown; email?: unknown; displayName?: unknown }; data?: { field_errors?: Record<string, unknown> } };
    if (!response.ok || !body.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, value] of Object.entries(body.data?.field_errors ?? {})) fieldErrors[key] = plainText(value);
      const isUnavailable = response.status === 404 || response.status >= 500;
      return NextResponse.json({ success: false, error: isUnavailable ? "Registration is temporarily unavailable. Please try again later." : (plainText(body.message) || "Unable to create your seller account."), fieldErrors }, { status: isUnavailable ? 503 : response.status });
    }
    if (!body.user || typeof body.user.id !== "number" || typeof body.user.email !== "string" || typeof body.user.displayName !== "string") return NextResponse.json({ success: false, error: "WordPress returned an invalid registration response." }, { status: 502 });
    return NextResponse.json({ success: true, message: "Your seller account has been created. You can now log in.", user: body.user }, { status: 201 });
  } catch (error) {
    console.error("WordPress registration request failed", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({ success: false, error: "Unable to reach the registration server. Please try again." }, { status: 503 });
  }
}
