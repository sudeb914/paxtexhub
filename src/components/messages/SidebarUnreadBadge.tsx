"use client";
import { useNotifications } from "@/hooks/use-messaging";
export function SidebarUnreadBadge({ compact }: { compact: boolean }) { const { data } = useNotifications(); const count = data?.unreadConversationCount ?? 0; if (!count) return null; return <span className={`${compact ? "absolute right-2 top-2" : "ml-auto"} grid min-w-5 place-items-center rounded-full bg-[#0864ff] px-1.5 py-0.5 text-[11px] font-bold text-white`}>{count > 99 ? "99+" : count}</span>; }
