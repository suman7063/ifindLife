
export interface Message {
  id: string | number;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isMine: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount?: number;
  otherUserId: string; // For backward compatibility
}

export interface MessagingHook {
  messages: Message[];
  conversations: Conversation[];
  currentConversation: string | null;
  loading: boolean;
  sending: boolean;
  fetchMessages: (userId: string) => Promise<void>;
  sendMessage: (userId: string, content: string) => Promise<boolean>;
  fetchConversations: () => Promise<void>;
  setCurrentConversation: (id: string | null) => void;
}
