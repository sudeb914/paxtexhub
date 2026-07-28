import { messagingRoute } from "@/lib/server/messaging-route";
export const dynamic = "force-dynamic";
export async function GET() { return messagingRoute("/notifications"); }
