import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { uploadAuthenticatedWordPressImage, WordPressMediaUploadError } from "@/services/wordpress/wordpress-media-service";

export const dynamic = "force-dynamic";
const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const token = (await cookies()).get("partexhub_token")?.value;
  if (!token) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  let formData: FormData;
  try { formData = await request.formData(); } catch { return NextResponse.json({ error: "Invalid upload." }, { status: 400 }); }
  const file = formData.get("photo");
  if (!(file instanceof File) || !file.size) return NextResponse.json({ error: "Choose a profile photo." }, { status: 400 });
  if (!allowed.has(file.type)) return NextResponse.json({ error: "Choose a JPG, PNG, or WebP image." }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Profile photo must be 5 MB or smaller." }, { status: 400 });
  try {
    const id = await uploadAuthenticatedWordPressImage(token, file, "Seller profile photo");
    const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
    const media = await fetch(`${wordpressUrl}/wp-json/wp/v2/media/${id}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).then((response) => response.json()) as { source_url?: unknown };
    return NextResponse.json({ id, url: typeof media.source_url === "string" ? media.source_url : null });
  } catch (error) {
    if (error instanceof WordPressMediaUploadError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Unexpected profile photo upload error", error);
    return NextResponse.json({ error: "Unable to upload the profile photo." }, { status: 500 });
  }
}
