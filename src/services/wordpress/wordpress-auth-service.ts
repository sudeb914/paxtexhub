import "server-only";
import type { AuthenticatedUser } from "@/types/auth";

interface WordPressAuthenticatedUser {
  id?: unknown;
  username?: unknown;
  slug?: unknown;
  name?: unknown;
  email?: unknown;
  roles?: unknown;
}

export class WordPressAuthError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "WordPressAuthError";
  }
}

export async function getAuthenticatedWordPressUser(token: string): Promise<AuthenticatedUser> {
  const wordpressUrl = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!wordpressUrl) throw new WordPressAuthError(500, "WORDPRESS_URL is not configured");

  let response: Response;
  try {
    response = await fetch(`${wordpressUrl}/wp-json/wp/v2/users/me?context=edit`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    console.error("Unable to reach the WordPress current-user endpoint", error);
    throw new WordPressAuthError(503, "Unable to reach the authentication server");
  }

  if (!response.ok) {
    const isUnauthorized = response.status === 401 || response.status === 403;
    throw new WordPressAuthError(isUnauthorized ? 401 : 502, isUnauthorized ? "Your session is invalid or expired" : "Unable to load your account");
  }

  const data = await response.json() as WordPressAuthenticatedUser;
  if (typeof data.id !== "number") throw new WordPressAuthError(502, "WordPress returned an invalid user response");

  const username = typeof data.username === "string" && data.username ? data.username : typeof data.slug === "string" ? data.slug : "";
  const displayName = typeof data.name === "string" ? data.name.trim() : "";
  const roles = Array.isArray(data.roles) ? data.roles.filter((role): role is string => typeof role === "string") : [];

  return {
    id: data.id,
    username,
    displayName,
    email: typeof data.email === "string" ? data.email : "",
    role: roles[0] ?? "subscriber",
  };
}
