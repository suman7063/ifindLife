
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

export interface MessagingUser {
  id: string;
  name: string;
  profile_picture?: string;
  online?: boolean;
  last_seen?: string;
}

export interface Conversation {
  user: MessagingUser;
  lastMessage?: Message;
  unreadCount: number;
  // Backward compatibility properties
  userId?: string;
  userName?: string;
  userAvatar?: string;
  lastMessageTime?: string;
}

export interface MessagingRepository {
  getMessages: (userId: string, otherUserId: string) => Promise<Message[]>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<Message | null>;
  markAsRead: (messageId: string) => Promise<boolean>;
  getConversations: (userId: string) => Promise<Conversation[]>;
  getUserById: (userId: string) => Promise<MessagingUser | null>;
  searchUsers: (query: string) => Promise<MessagingUser[]>;
}

export interface UseMessagingReturn {
  sendMessage: (recipientId: string, message: string) => Promise<boolean>;
  getMessages: (recipientId: string) => Promise<Message[]>;
  markMessageAsRead: (messageId: string) => Promise<boolean>;
  conversations: Conversation[];
  loadingConversations: boolean;
  refreshConversations: () => Promise<void>;
  searchUsers: (query: string) => Promise<MessagingUser[]>;
  // Added for backward compatibility
  messages: Message[];
  fetchMessages: (partnerId: string) => Promise<Message[]>;
  fetchConversations: () => Promise<Conversation[]>;
  messagesLoading: boolean;
  conversationsLoading: boolean;
  loading: boolean;
}

export interface UseMessagesReturn {
  messages: Message[];
  messagesLoading: boolean;
  fetchMessages: (partnerId: string) => Promise<Message[]>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  error: string | null;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  conversationsLoading: boolean;
  fetchConversations: () => Promise<Conversation[]>;
  error: string | null;
}
