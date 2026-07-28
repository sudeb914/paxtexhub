import { NextResponse } from "next/server";

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;
const MAX_COOKIE_AGE = 60 * 60 * 24 * 30;

interface WordPressTokenResponse {
  token?: unknown;
  message?: unknown;
  code?: unknown;
}

function plainText(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#039;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function getTokenMaxAge(token: string) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return DEFAULT_MAX_AGE;
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as { exp?: unknown };
    if (typeof payload.exp !== "number") return DEFAULT_MAX_AGE;
    const secondsUntilExpiry = Math.floor(payload.exp - Date.now() / 1000);
    if (secondsUntilExpiry <= 0) return 0;
    return Math.min(secondsUntilExpiry, MAX_COOKIE_AGE);
  } catch {
    return DEFAULT_MAX_AGE;
  }
}

export async function POST(request: Request) {
  let credentials: { username?: unknown; password?: unknown };
  try {
    credentials = await request.json() as { username?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ error: "Please enter your email or username and password." }, { status: 400 });
  }

  const username = typeof credentials.username === "string" ? credentials.username.trim() : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";
  if (!username || !password) {
    return NextResponse.json({ error: "Please enter your email or username and password." }, { status: 400 });
  }

  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!wordpressUrl) {
    console.error("WORDPRESS_URL is not configured");
    return NextResponse.json({ error: "Login is temporarily unavailable. Please try again later." }, { status: 500 });
  }

  try {
    const wordpressResponse = await fetch(`${wordpressUrl}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    let data: WordPressTokenResponse = {};
    try {
      data = await wordpressResponse.json() as WordPressTokenResponse;
    } catch {
      // WordPress or a proxy may return a non-JSON server error.
    }

    if (!wordpressResponse.ok || typeof data.token !== "string" || !data.token) {
      const wordpressMessage = plainText(data.message);
      const isCredentialError = wordpressResponse.status === 401 || wordpressResponse.status === 403;
      const error = isCredentialError
        ? (wordpressMessage || "Invalid email/username or password.")
        : "The login server is unavailable. Please try again shortly.";
      return NextResponse.json({ error }, { status: isCredentialError ? 401 : 502 });
    }

    const maxAge = getTokenMaxAge(data.token);
    if (maxAge <= 0) {
      return NextResponse.json({ error: "The login server returned an expired session. Please try again." }, { status: 502 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("partexhub_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return response;
  } catch (error) {
    console.error("WordPress JWT login request failed", error);
    return NextResponse.json({ error: "Unable to reach the login server. Check your connection and try again." }, { status: 503 });
  }
}
