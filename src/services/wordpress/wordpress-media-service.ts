import "server-only";

interface WordPressUploadedMedia {
  id?: unknown;
  source_url?: unknown;
}

interface WordPressMediaError {
  message?: unknown;
}

export class WordPressMediaUploadError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "WordPressMediaUploadError";
  }
}

function safeFilename(filename: string) {
  const extension = filename.includes(".") ? `.${filename.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "")}` : "";
  const base = filename.replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "car-image";
  return `${base}${extension}`;
}

export async function uploadAuthenticatedWordPressImage(token: string, file: File, altText: string) {
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!wordpressUrl) throw new WordPressMediaUploadError(500, "WORDPRESS_URL is not configured");

  let response: Response;
  try {
    response = await fetch(`${wordpressUrl}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="${safeFilename(file.name)}"`,
        "X-WP-Alt-Text": altText,
      },
      body: Buffer.from(await file.arrayBuffer()),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    console.error("Unable to reach the WordPress media endpoint", error);
    throw new WordPressMediaUploadError(503, `Unable to upload ${file.name}.`);
  }

  if (!response.ok) {
    let message = `WordPress could not upload ${file.name}.`;
    try {
      const body = await response.json() as WordPressMediaError;
      if (typeof body.message === "string") message = body.message.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    } catch { /* A proxy may return a non-JSON error. */ }
    const status = response.status === 401 ? 401 : response.status === 403 ? 403 : response.status >= 500 ? 502 : 400;
    throw new WordPressMediaUploadError(status, message);
  }

  const media = await response.json() as WordPressUploadedMedia;
  if (typeof media.id !== "number") throw new WordPressMediaUploadError(502, "WordPress returned an invalid media response.");

  // The binary endpoint cannot set alt text reliably across all WP configurations.
  await fetch(`${wordpressUrl}/wp-json/wp/v2/media/${media.id}`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ alt_text: altText }),
    cache: "no-store",
  }).catch(() => undefined);

  return media.id;
}
