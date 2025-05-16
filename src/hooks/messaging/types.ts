
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  timestamp?: Date;
  isMine: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  profilePicture?: string;
  lastMessageDate: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface MessagingContextType {
  messages: Message[];
  conversations: Conversation[];
  selectedConversation: string | null;
  loading: boolean;
  sending: boolean;
  fetchMessages: (recipientId: string) => Promise<void>;
  sendMessage: (recipientId: string, content: string) => Promise<boolean>;
  fetchConversations: () => Promise<void>;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  selectedConversation: string | null;
  selectConversation: (conversationId: string) => void;
  fetchConversations: () => Promise<void>;
  setCurrentConversation: (conversationId: string) => void;
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<boolean>;
  fetchMessages: (conversationId: string) => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}
