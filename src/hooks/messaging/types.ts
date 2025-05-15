
export interface Conversation {
  id: string;
  name: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount?: number;
  participantId?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isMine: boolean;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
}

export interface MessagingHook {
  conversations: Conversation[];
  messages: Message[];
  loading: boolean;
  sending?: boolean;
  currentConversation?: string;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<boolean>;
  setCurrentConversation: (conversationId: string) => void;
}

export interface MessagingUser {
  id: string;
  name?: string;
  email?: string;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  conversationsLoading: boolean;
  fetchConversations: () => Promise<Conversation[]>;
  error: string | null;
}

export interface UseMessagesReturn {
  messages: Message[];
  messagesLoading: boolean;
  fetchMessages: (partnerId: string) => Promise<Message[]>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  error: string | null;
}
