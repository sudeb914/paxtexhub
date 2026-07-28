import { messagingRoute } from "@/lib/server/messaging-route";
export async function POST(_: Request, { params }: { params: Promise<{ conversationId: string }> }) { const { conversationId } = await params; return messagingRoute(`/conversations/${encodeURIComponent(conversationId)}/read`, { method: "POST" }); }
