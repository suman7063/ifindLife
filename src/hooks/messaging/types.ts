
import { Message } from '@/types/appointments';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/types/supabase/expert';

export interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export type MessagingUser = ExpertProfile | UserProfile | null;

export interface UseMessagingReturn {
  messages: Message[];
  conversations: Conversation[];
  loading: boolean;
  messagesLoading: boolean;
  conversationsLoading: boolean;
  error: string | null;
  fetchMessages: (partnerId: string) => Promise<Message[]>;
  fetchConversations: () => Promise<Conversation[]>;
  sendMessage: (receiverId: string, content: string) => Promise<Message | null>;
  markConversationAsRead: (partnerId: string) => Promise<boolean>;
}
