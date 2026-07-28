import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedWordPressUser, WordPressAuthError } from "@/services/wordpress/wordpress-auth-service";
import { createAuthenticatedWordPressListing, WordPressListingCreateError } from "@/services/wordpress/wordpress-create-listing-service";
import { uploadAuthenticatedWordPressImage, WordPressMediaUploadError } from "@/services/wordpress/wordpress-media-service";
import type { CreateListingResponse } from "@/types/create-listing";
import { getWordPressProfile, WordPressProfileError } from "@/services/wordpress/wordpress-profile-service";
import { calculateProfileCompletion } from "@/lib/profile-completion";

export const dynamic = "force-dynamic";

const currentYear = new Date().getUTCFullYear();
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 5;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const listingSchema = z.object({
  title: z.string().trim().min(3, "Enter a title with at least 3 characters.").max(150, "Title must be 150 characters or less."),
  description: z.string().trim().min(10, "Enter a description with at least 10 characters.").max(10000, "Description is too long."),
  brandId: z.coerce.number().int().positive("Select a brand."),
  carTypeId: z.coerce.number().int().positive("Select a body type."),
  locationId: z.coerce.number().int().positive("Select a location."),
  model: z.string().trim().min(1, "Enter the model.").max(100, "Model must be 100 characters or less."),
  year: z.coerce.number().int().min(1886, "Enter a valid year.").max(currentYear + 1, `Year cannot be later than ${currentYear + 1}.`),
  price: z.coerce.number().finite().positive("Price must be greater than zero."),
  mileage: z.coerce.number().finite().min(0, "Mileage cannot be negative."),
}).strict();

function validateImage(value: FormDataEntryValue | null, field: string, required: boolean) {
  if (!(value instanceof File) || value.size === 0) return required ? `${field} is required.` : null;
  if (!ALLOWED_IMAGE_TYPES.has(value.type)) return `${field} must be a JPG, PNG, or WebP image.`;
  if (value.size > MAX_IMAGE_SIZE) return `${field} must be 5 MB or smaller.`;
  return null;
}

export async function POST(request: Request) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const completion = calculateProfileCompletion(await getWordPressProfile(token));
    if (!completion.isComplete) {
      return NextResponse.json({ error: "Complete your seller profile before adding a listing.", code: "PROFILE_INCOMPLETE", profileCompletion: completion }, { status: 403 });
    }
  } catch (error) {
    if (error instanceof WordPressProfileError && error.status === 401) return NextResponse.json({ error: "Your session is invalid or expired." }, { status: 401 });
    if (error instanceof WordPressProfileError) return NextResponse.json({ error: "Unable to verify your profile. Please try again." }, { status: error.status });
    return NextResponse.json({ error: "Unable to verify your profile. Please try again." }, { status: 500 });
  }

  let formData: FormData;
  try { formData = await request.formData(); } catch { return NextResponse.json({ error: "Invalid form data." }, { status: 400 }); }
  const parsed = listingSchema.safeParse({ title: formData.get("title"), description: formData.get("description"), brandId: formData.get("brandId"), carTypeId: formData.get("carTypeId"), locationId: formData.get("locationId"), model: formData.get("model"), year: formData.get("year"), price: formData.get("price"), mileage: formData.get("mileage") });
  const featuredImage = formData.get("featuredImage");
  const galleryImages = formData.getAll("galleryImages").filter((value): value is File => value instanceof File && value.size > 0);
  const imageErrors: Record<string, string> = {};
  const featuredError = validateImage(featuredImage, "Featured image", true);
  if (featuredError) imageErrors.featuredImage = featuredError;
  if (galleryImages.length > MAX_GALLERY_IMAGES) imageErrors.galleryImages = `Choose no more than ${MAX_GALLERY_IMAGES} gallery images.`;
  else for (const image of galleryImages) { const imageError = validateImage(image, "Each gallery image", false); if (imageError) { imageErrors.galleryImages = imageError; break; } }
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return NextResponse.json({ error: "Please correct the highlighted fields.", fieldErrors: { ...fieldErrors, ...imageErrors } }, { status: 400 });
  }
  if (Object.keys(imageErrors).length) return NextResponse.json({ error: "Please correct the highlighted image fields.", fieldErrors: imageErrors }, { status: 400 });

  try {
    await getAuthenticatedWordPressUser(token);
    const featuredMediaId = await uploadAuthenticatedWordPressImage(token, featuredImage as File, parsed.data.title);
    const galleryMediaIds: number[] = [];
    for (const image of galleryImages) galleryMediaIds.push(await uploadAuthenticatedWordPressImage(token, image, parsed.data.title));
    const listing = await createAuthenticatedWordPressListing(token, parsed.data, { featuredMediaId, galleryMediaIds });
    const response: CreateListingResponse = { success: true, listing };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof WordPressAuthError && error.status === 401) return NextResponse.json({ error: "Your session is invalid or expired." }, { status: 401 });
    if (error instanceof WordPressMediaUploadError) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error instanceof WordPressListingCreateError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Unexpected listing creation error", error);
    return NextResponse.json({ error: "Unable to create the listing. Please try again." }, { status: 500 });
  }
}
