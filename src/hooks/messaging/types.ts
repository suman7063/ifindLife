
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  // UI-specific properties
  isMine?: boolean;
  timestamp?: Date;
}

export interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  name: string; // Required now
  profilePicture?: string; // Added
  last_message: string;
  lastMessage?: string; // Alias for compatibility
  last_message_time: string;
  lastMessageDate: string; // Added
  unread_count: number;
  unreadCount?: number; // Alias for compatibility
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  sendMessage: (recipientId: string, content: string) => Promise<boolean>;
  fetchMessages: (recipientId: string) => Promise<void>;
}
