"use client";
import { useRouter } from "next/navigation";
import { LoaderCircle, MessageCircle } from "lucide-react";
import { useState } from "react";

export function StartConversationButton({ listingId, receiverId }: { listingId: number; receiverId: number }) {
  const router = useRouter(); const [pending, setPending] = useState(false); const [error, setError] = useState("");
  async function start() { if (pending) return; setPending(true); setError(""); try { const response = await fetch("/api/messages/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listing_id: listingId, receiver_id: receiverId }) }); const body = await response.json() as { conversationId?: number; message?: string }; if (response.status === 401) { router.push(`/login?redirect=${encodeURIComponent("/cars")}`); return; } if (!response.ok || !body.conversationId) throw new Error(body.message || "Unable to start conversation"); router.push(`/dashboard/messages?conversation=${body.conversationId}`); } catch (e) { setError(e instanceof Error ? e.message : "Unable to start conversation"); setPending(false); } }
  return <><button className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60" disabled={pending} onClick={() => void start()} type="button">{pending ? <LoaderCircle className="size-4 animate-spin"/> : <MessageCircle className="size-4"/>}{pending ? "Opening chat..." : "Message Seller"}</button>{error ? <p className="mt-2 text-xs text-red-600" role="alert">{error}</p> : null}</>;
}
