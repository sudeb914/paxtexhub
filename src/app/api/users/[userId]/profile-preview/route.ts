import { messagingRoute } from "@/lib/server/messaging-route";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: Promise<{ userId: string }> }) { const { userId } = await params; return messagingRoute(`/users/${encodeURIComponent(userId)}/profile-preview`); }
