import { messagingRoute } from "@/lib/server/messaging-route";
export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params; const url = new URL(request.url);
  return messagingRoute(`/conversations/${encodeURIComponent(conversationId)}?page=${url.searchParams.get("page") ?? "1"}&per_page=${url.searchParams.get("per_page") ?? "100"}`);
}
