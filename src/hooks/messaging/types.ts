
// hooks/messaging/types.ts - COMPLETE MESSAGING TYPES
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  read: boolean;
  message_type?: 'text' | 'image' | 'file';
  timestamp?: Date;
  isMine?: boolean;
}

export interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  
  // Component compatibility aliases
  name?: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount?: number;
  participantId?: string;
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error?: string | null;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}
