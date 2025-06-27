
export interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  name: string; // Made required
  profilePicture?: string;
  last_message: string;
  lastMessage?: string;
  last_message_time: string;
  lastMessageDate: string;
  unread_count: number;
  unreadCount?: number;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  isMine?: boolean;
  timestamp?: Date;
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
  setMessages: (messages: Message[]) => void;
  fetchMessages: (conversationId: string) => Promise<Message[]>;
}
