import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getWordPressProfile, updateWordPressProfile, WordPressProfileError } from "@/services/wordpress/wordpress-profile-service";

export const dynamic = "force-dynamic";
const optionalUrl = z.union([z.literal(""), z.string().url("Enter a valid URL.").max(300)]);
const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(60), lastName: z.string().trim().min(1, "Last name is required.").max(60), displayName: z.string().trim().min(1, "Display name is required.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(254), phone: z.string().trim().max(40).refine((value) => !value || (/^[+()\-\s\d.]+$/.test(value) && value.replace(/\D/g, "").length >= 7), "Enter a valid phone number."),
  companyName: z.string().trim().max(120), businessType: z.enum(["", "car-dealer", "dealership", "broker"]), website: optionalUrl, bio: z.string().trim().max(2000),
  country: z.string().trim().max(80), city: z.string().trim().max(80), zipCode: z.string().trim().max(20), streetAddress: z.string().trim().max(200),
  facebook: optionalUrl, instagram: optionalUrl, linkedin: optionalUrl, youtube: optionalUrl,
  receiveNotifications: z.boolean(), marketingEmails: z.boolean(), publicPhone: z.boolean(), profilePhotoId: z.number().int().positive().nullable(),
}).strict();

function tokenFromCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) { return cookieStore.get("partexhub_token")?.value; }
function failure(error: unknown) {
  if (error instanceof WordPressProfileError) return NextResponse.json({ error: error.message, fieldErrors: error.fieldErrors }, { status: error.status });
  console.error("Unexpected profile API error", error);
  return NextResponse.json({ error: "Unable to process your profile. Please try again." }, { status: 500 });
}

export async function GET() {
  const token = tokenFromCookie(await cookies());
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try { return NextResponse.json({ profile: await getWordPressProfile(token) }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { return failure(error); }
}

export async function PUT(request: Request) {
  const token = tokenFromCookie(await cookies());
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid profile data." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) if (!fieldErrors[String(issue.path[0])]) fieldErrors[String(issue.path[0])] = issue.message;
    return NextResponse.json({ error: "Please correct the highlighted fields.", fieldErrors }, { status: 400 });
  }
  try { return NextResponse.json({ success: true, profile: await updateWordPressProfile(token, parsed.data) }); } catch (error) { return failure(error); }
}
