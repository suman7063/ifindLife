
export interface Conversation {
  id: string;
  name: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount?: number;
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
