
export interface MessagingUser {
  id: string;
  name: string;
  profile_picture?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage?: Message;
  lastMessageTime: string;
  unreadCount: number;
}

export interface MessagingState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  users: MessagingUser[];
  loading: boolean;
  messageLoading: boolean;
  error: Error | null;
}

export interface MessagingFunctions {
  sendMessage: (content: string) => Promise<boolean>;
  selectConversation: (userId: string) => void;
  markAsRead: (messageId: string) => void;
  refreshMessages: () => Promise<void>;
  refreshConversations: () => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
}

export type MessagingContextType = MessagingState & MessagingFunctions & {
  conversationsLoading: boolean;
  messagesLoading: boolean;
};
