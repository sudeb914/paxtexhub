export interface MessageParticipant { id: number; displayName: string; avatarUrl: string | null }
export interface ConversationSummary { id: number; listingId: number; listingTitle: string; participant: MessageParticipant; lastMessage: string; lastMessageTime: string | null; unreadCount: number; status: string }
export interface ChatMessage { id: number | string; conversationId: number; senderId: number; receiverId: number; messageText: string; isRead: boolean; sentAt: string; messageType: "text"; optimistic?: boolean }
export interface ConversationDetail { conversation: ConversationSummary & { currentUserId: number }; messages: ChatMessage[]; pagination: { page: number; perPage: number; total: number; totalPages: number } }
export interface ConversationsResponse { conversations: ConversationSummary[] }
export interface NotificationsResponse { unreadConversationCount: number; unreadMessageCount: number }
