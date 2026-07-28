import { NextResponse } from "next/server";
import { z } from "zod";
import { messagingRoute } from "@/lib/server/messaging-route";
const schema = z.object({ message_text: z.string().trim().min(1, "Message cannot be empty").max(3000, "Message cannot exceed 3000 characters") });
export async function POST(request: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid message" }, { status: 400 });
  const { conversationId } = await params;
  return messagingRoute(`/conversations/${encodeURIComponent(conversationId)}/send`, { method: "POST", body: JSON.stringify(parsed.data) });
}
