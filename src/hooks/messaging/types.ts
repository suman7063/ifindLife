
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
  id: string;
  user: MessagingUser;
  lastMessage?: Message;
  unreadCount: number;
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
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
