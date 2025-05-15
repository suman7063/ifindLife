
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at?: string;
  
  // UI helpers
  isMine?: boolean;
  timestamp?: Date;
}

export interface Conversation {
  id: string;
  name: string;
  profilePicture?: string;
  lastMessageDate: string;
  unreadCount?: number;
}

// Add the missing types for messaging hooks
export interface MessagingUser {
  id: string;
  name: string;
  profilePicture?: string;
  isOnline?: boolean;
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<boolean>;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  selectedConversation: string | null;
  selectConversation: (conversationId: string) => void;
}

export interface MessagingHook {
  sendMessage: (receiverId: string, content: string) => Promise<boolean>;
  getMessages: (conversationId: string) => Message[];
  getConversations: () => Conversation[];
  markAsRead: (messageId: string) => Promise<boolean>;
}
