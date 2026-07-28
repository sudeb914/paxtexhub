"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatMessage, ConversationDetail, ConversationsResponse, MessageReaction, NotificationsResponse, ProfilePreview, ReactionType, ReplyPreview } from "@/types/messaging";

async function api<T>(url: string, init?: RequestInit): Promise<T> { const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } }); const data = await response.json().catch(() => ({})) as T & { message?: string }; if (response.status === 401) { window.location.assign("/login"); throw new Error("Your session has expired"); } if (!response.ok) throw new Error(data.message || "Request failed"); return data; }
export function useConversations() { return useQuery({ queryKey: ["conversations"], queryFn: () => api<ConversationsResponse>("/api/messages/conversations"), refetchInterval: 3_000 }); }
function mergeConversation(oldData: ConversationDetail | undefined, newData: ConversationDetail) {
  if (!oldData) return newData;
  const optimistic = oldData.messages.filter((message) => message.optimistic);
  const serverIds = new Set(newData.messages.map((message) => String(message.id)));
  return { ...newData, messages: [...newData.messages, ...optimistic.filter((message) => !serverIds.has(String(message.id)))] };
}
function normalizeConversation(data: ConversationDetail): ConversationDetail { return { ...data, messages: data.messages.map((message) => ({ ...message, replyTo: message.replyTo ?? null, reactions: Array.isArray(message.reactions) ? message.reactions : [] })) }; }
export function useConversation(id: number | null) { return useQuery({ queryKey: ["conversation", id], queryFn: async () => normalizeConversation(await api<ConversationDetail>(`/api/messages/conversations/${id}`)), enabled: Boolean(id), refetchInterval: 3_000, structuralSharing: (oldData, newData) => mergeConversation(oldData as ConversationDetail | undefined, newData as ConversationDetail) }); }
export function useNotifications() { return useQuery({ queryKey: ["message-notifications"], queryFn: () => api<NotificationsResponse>("/api/messages/notifications"), refetchInterval: 3_000 }); }
export function useReadConversation() { const client = useQueryClient(); return useMutation({ mutationFn: (id: number) => api(`/api/messages/conversations/${id}/read`, { method: "POST" }), onSuccess: (_, id) => { void client.invalidateQueries({ queryKey: ["conversations"] }); void client.invalidateQueries({ queryKey: ["message-notifications"] }); void client.invalidateQueries({ queryKey: ["conversation", id] }); } }); }
export function useSendMessage(conversationId: number | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ message, replyTo }: { message: string; replyTo: ReplyPreview | null }) => api<{ message: ChatMessage }>(`/api/messages/conversations/${conversationId}/send`, { method: "POST", body: JSON.stringify({ message, replyToMessageId: replyTo?.id ?? null }) }),
    onMutate: async ({ message, replyTo }) => { if (!conversationId) return; await client.cancelQueries({ queryKey: ["conversation", conversationId] }); const previous = client.getQueryData<ConversationDetail>(["conversation", conversationId]); if (previous) client.setQueryData<ConversationDetail>(["conversation", conversationId], { ...previous, messages: [...previous.messages, { id: `temp-${Date.now()}`, conversationId, senderId: previous.conversation.currentUserId, receiverId: previous.conversation.participant.id, messageText: message, isRead: false, sentAt: new Date().toISOString(), messageType: "text", replyTo, reactions: [], optimistic: true }] }); return { previous }; },
    onError: (_error, _message, context) => { if (context?.previous && conversationId) client.setQueryData(["conversation", conversationId], context.previous); },
    onSettled: () => { if (conversationId) void client.invalidateQueries({ queryKey: ["conversation", conversationId] }); void client.invalidateQueries({ queryKey: ["conversations"] }); },
  });
}

function updateMessageReactions(data: ConversationDetail | undefined, messageId: number, reactions: MessageReaction[]) { return data ? { ...data, messages: data.messages.map((message) => Number(message.id) === messageId ? { ...message, reactions } : message) } : data; }
export function useMessageReaction(conversationId: number | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId, reaction, remove }: { messageId: number; reaction: ReactionType; remove: boolean }) => api<{ reactions: MessageReaction[] }>(`/api/messages/${messageId}/reaction`, { method: remove ? "DELETE" : "POST", body: remove ? undefined : JSON.stringify({ reaction }) }),
    onMutate: async ({ messageId, reaction, remove }) => { if (!conversationId) return; const key = ["conversation", conversationId] as const; await client.cancelQueries({ queryKey: key }); const previous = client.getQueryData<ConversationDetail>(key); const current = previous?.messages.find((message) => Number(message.id) === messageId)?.reactions ?? []; let next = current.map((item) => item.reactedByCurrentUser ? { ...item, count: item.count - 1, reactedByCurrentUser: false } : item).filter((item) => item.count > 0); if (!remove) { const existing = next.find((item) => item.type === reaction); next = existing ? next.map((item) => item.type === reaction ? { ...item, count: item.count + 1, reactedByCurrentUser: true } : item) : [...next, { type: reaction, count: 1, reactedByCurrentUser: true }]; } client.setQueryData(key, updateMessageReactions(previous, messageId, next)); return { previous }; },
    onError: (_error, _variables, context) => { if (conversationId && context?.previous) client.setQueryData(["conversation", conversationId], context.previous); },
    onSuccess: (result, variables) => { if (conversationId) client.setQueryData<ConversationDetail>(["conversation", conversationId], (data) => updateMessageReactions(data, variables.messageId, result.reactions)); },
  });
}
export function useProfilePreview(userId: number | null, enabled: boolean) { return useQuery({ queryKey: ["profile-preview", userId], queryFn: () => api<ProfilePreview>(`/api/users/${userId}/profile-preview`), enabled: enabled && Boolean(userId), staleTime: 60_000 }); }
