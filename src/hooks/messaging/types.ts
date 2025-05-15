
import { Message } from '@/types/database/unified';

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantImage?: string;
  lastMessage?: string;
  unreadCount: number;
  lastMessageTime?: Date;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<any>;
  fetchMessages: () => Promise<void>;
  markAsRead: () => Promise<void>;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  fetchConversations: () => Promise<void>;
}

export interface MessagingHook {
  messages: Message[];
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  sendMessage: (recipientId: string, content: string) => Promise<any>;
  markAsRead: (recipientId: string) => Promise<void>;
  currentRecipient: string | null;
  setCurrentRecipient: (id: string | null) => void;
}
