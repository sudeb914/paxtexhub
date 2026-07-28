"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, ConversationDetail, ConversationsResponse, NotificationsResponse } from "@/types/messaging";

async function api<T>(url: string, init?: RequestInit): Promise<T> { const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } }); const data = await response.json().catch(() => ({})) as T & { message?: string }; if (response.status === 401) { window.location.assign("/login"); throw new Error("Your session has expired"); } if (!response.ok) throw new Error(data.message || "Request failed"); return data; }
export function useConversations() { return useQuery({ queryKey: ["conversations"], queryFn: () => api<ConversationsResponse>("/api/messages/conversations"), refetchInterval: 3_000 }); }
export function useConversation(id: number | null) { return useQuery({ queryKey: ["conversation", id], queryFn: () => api<ConversationDetail>(`/api/messages/conversations/${id}`), enabled: Boolean(id), refetchInterval: 3_000 }); }
export function useNotifications() { return useQuery({ queryKey: ["message-notifications"], queryFn: () => api<NotificationsResponse>("/api/messages/notifications"), refetchInterval: 3_000 }); }
export function useReadConversation() { const client = useQueryClient(); return useMutation({ mutationFn: (id: number) => api(`/api/messages/conversations/${id}/read`, { method: "POST" }), onSuccess: (_, id) => { void client.invalidateQueries({ queryKey: ["conversations"] }); void client.invalidateQueries({ queryKey: ["message-notifications"] }); void client.invalidateQueries({ queryKey: ["conversation", id] }); } }); }
export function useSendMessage(conversationId: number | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (messageText: string) => api<{ message: ChatMessage }>(`/api/messages/conversations/${conversationId}/send`, { method: "POST", body: JSON.stringify({ message_text: messageText }) }),
    onMutate: async (messageText) => { if (!conversationId) return; await client.cancelQueries({ queryKey: ["conversation", conversationId] }); const previous = client.getQueryData<ConversationDetail>(["conversation", conversationId]); if (previous) client.setQueryData<ConversationDetail>(["conversation", conversationId], { ...previous, messages: [...previous.messages, { id: `temp-${Date.now()}`, conversationId, senderId: previous.conversation.currentUserId, receiverId: previous.conversation.participant.id, messageText, isRead: false, sentAt: new Date().toISOString(), messageType: "text", optimistic: true }] }); return { previous }; },
    onError: (_error, _message, context) => { if (context?.previous && conversationId) client.setQueryData(["conversation", conversationId], context.previous); },
    onSettled: () => { if (conversationId) void client.invalidateQueries({ queryKey: ["conversation", conversationId] }); void client.invalidateQueries({ queryKey: ["conversations"] }); },
  });
}
