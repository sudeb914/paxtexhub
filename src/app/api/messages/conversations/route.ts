import { NextResponse } from "next/server";
import { z } from "zod";
import { messagingRoute } from "@/lib/server/messaging-route";
export const dynamic = "force-dynamic";
export async function GET() { return messagingRoute("/conversations"); }
export async function POST(request: Request) {
  const parsed = z.object({ listing_id: z.coerce.number().int().positive(), receiver_id: z.coerce.number().int().positive() }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "A valid listing and receiver are required" }, { status: 400 });
  return messagingRoute("/conversations", { method: "POST", body: JSON.stringify(parsed.data) });
}
