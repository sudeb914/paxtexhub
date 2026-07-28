export interface MessageParticipant { id: number; displayName: string; avatarUrl: string | null }
export interface ConversationSummary { id: number; listingId: number; listingTitle: string; participant: MessageParticipant; lastMessage: string; lastMessageTime: string | null; unreadCount: number; status: string }
export type ReactionType = "like" | "love" | "laugh" | "wow" | "sad";
export interface MessageReaction { type: ReactionType; count: number; reactedByCurrentUser: boolean }
export interface ReplyPreview { id: number; senderId: number; message: string }
export interface ChatMessage { id: number | string; conversationId: number; senderId: number; receiverId: number; messageText: string; isRead: boolean; sentAt: string; messageType: "text"; replyTo: ReplyPreview | null; reactions: MessageReaction[]; optimistic?: boolean }
export interface ConversationDetail { conversation: ConversationSummary & { currentUserId: number }; messages: ChatMessage[]; pagination: { page: number; perPage: number; total: number; totalPages: number } }
export interface ConversationsResponse { conversations: ConversationSummary[] }
export interface NotificationsResponse { unreadConversationCount: number; unreadMessageCount: number }
export interface ProfilePreview { id: number; displayName: string; profilePhotoUrl: string | null; roleLabel: string; companyName: string; businessType: string; city: string; country: string; bioExcerpt: string; phone: string | null; publicProfileUrl: string }
