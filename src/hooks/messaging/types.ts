
import { Message } from '@/types/appointments';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/types/supabase/expert';
import { ExpertProfile as AuthExpertProfile } from '@/contexts/auth/types';

// Updated to accept both ExpertProfile types
export type MessagingUser = ExpertProfile | AuthExpertProfile | UserProfile | null;

export interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

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
