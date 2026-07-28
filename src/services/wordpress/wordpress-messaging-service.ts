import "server-only";

export class MessagingApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); this.name = "MessagingApiError"; }
}

export async function wordpressMessagingRequest<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const base = (process.env.WORDPRESS_URL ?? "").replace(/\/$/, "");
  if (!base) throw new MessagingApiError(500, "WORDPRESS_URL is not configured");
  let response: Response;
  try {
    response = await fetch(`${base}/wp-json/partexhub/v1${path}`, {
      ...init,
      headers: { Accept: "application/json", Authorization: `Bearer ${token}`, ...(init?.body ? { "Content-Type": "application/json" } : {}), ...init?.headers },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch { throw new MessagingApiError(503, "The messaging service is temporarily unavailable"); }
  const data = await response.json().catch(() => ({})) as { message?: string };
  if (!response.ok) throw new MessagingApiError(response.status, data.message || "Messaging request failed");
  return data as T;
}
