import { NextResponse } from "next/server";
import { z } from "zod";
import { messagingRoute } from "@/lib/server/messaging-route";

const schema = z.object({ reaction: z.enum(["like", "love", "laugh", "wow", "sad"]) });
export async function POST(request: Request, { params }: { params: Promise<{ messageId: string }> }) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Unsupported reaction" }, { status: 400 });
  const { messageId } = await params;
  return messagingRoute(`/messages/${encodeURIComponent(messageId)}/reaction`, { method: "POST", body: JSON.stringify(parsed.data) });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ messageId: string }> }) {
  const { messageId } = await params;
  return messagingRoute(`/messages/${encodeURIComponent(messageId)}/reaction`, { method: "DELETE" });
}
