import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedWordPressUser, WordPressAuthError } from "@/services/wordpress/wordpress-auth-service";
import { getOwnedWordPressListing, trashOwnedWordPressListing, updateOwnedWordPressListing } from "@/services/wordpress/wordpress-edit-listing-service";
import { WordPressListingCreateError } from "@/services/wordpress/wordpress-create-listing-service";
import { uploadAuthenticatedWordPressImage, WordPressMediaUploadError } from "@/services/wordpress/wordpress-media-service";

export const dynamic = "force-dynamic";
const schema = z.object({ title: z.string().trim().min(3).max(150), description: z.string().trim().min(10).max(10000), brandId: z.coerce.number().int().positive(), carTypeId: z.coerce.number().int().positive(), locationId: z.coerce.number().int().positive(), model: z.string().trim().min(1).max(100), year: z.coerce.number().int().min(1886).max(new Date().getUTCFullYear() + 1), price: z.coerce.number().positive(), mileage: z.coerce.number().min(0) }).strict();
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function idFrom(params: Promise<{ id: string }>) { return params.then(({ id }) => Number(id)); }
function errorResponse(error: unknown) {
  if (error instanceof WordPressAuthError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof WordPressListingCreateError || error instanceof WordPressMediaUploadError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error("Listing edit request failed", error); return NextResponse.json({ error: "Unable to process this listing." }, { status: 500 });
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const id = await idFrom(params); if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid listing ID." }, { status: 400 });
  try { const user = await getAuthenticatedWordPressUser(token); return NextResponse.json({ listing: await getOwnedWordPressListing(token, user.id, id) }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const id = await idFrom(params); if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid listing ID." }, { status: 400 });
  let data: FormData; try { data = await request.formData(); } catch { return NextResponse.json({ error: "Invalid form data." }, { status: 400 }); }
  const parsed = schema.safeParse({ title: data.get("title"), description: data.get("description"), brandId: data.get("brandId"), carTypeId: data.get("carTypeId"), locationId: data.get("locationId"), model: data.get("model"), year: data.get("year"), price: data.get("price"), mileage: data.get("mileage") });
  if (!parsed.success) { const fieldErrors: Record<string, string> = {}; for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message; return NextResponse.json({ error: "Please correct the highlighted fields.", fieldErrors }, { status: 400 }); }
  const featured = data.get("featuredImage"); const gallery = data.getAll("galleryImages").filter((value): value is File => value instanceof File && value.size > 0);
  const files = [featured, ...gallery].filter((value): value is File => value instanceof File && value.size > 0);
  if (gallery.length > 5 || files.some((file) => !allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024)) return NextResponse.json({ error: "Use up to 5 JPG, PNG, or WebP gallery images, each no larger than 5 MB." }, { status: 400 });
  try {
    const user = await getAuthenticatedWordPressUser(token); const existing = await getOwnedWordPressListing(token, user.id, id);
    const featuredMediaId = featured instanceof File && featured.size ? await uploadAuthenticatedWordPressImage(token, featured, parsed.data.title) : existing.featuredImage?.id ?? 0;
    const galleryMediaIds = gallery.length ? await Promise.all(gallery.map((file) => uploadAuthenticatedWordPressImage(token, file, parsed.data.title))) : existing.galleryImages.map((image) => image.id);
    return NextResponse.json({ success: true, listing: await updateOwnedWordPressListing(token, user.id, id, parsed.data, { featuredMediaId, galleryMediaIds }) });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const id = await idFrom(params);
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid listing ID." }, { status: 400 });
  try {
    const user = await getAuthenticatedWordPressUser(token);
    const listing = await trashOwnedWordPressListing(token, user.id, id);
    return NextResponse.json({ success: true, listing });
  } catch (error) {
    return errorResponse(error);
  }
}
