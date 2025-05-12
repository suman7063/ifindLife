
import { Message } from '@/types/appointments';
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '@/types/supabase/expert';
import { ExpertProfile as AuthExpertProfile } from '@/contexts/auth/types';

// Update MessagingUser type to ensure it has consistent id type (string)
export interface MessagingUser {
  id: string;
  name?: string;
  email?: string;
  profile_picture?: string;
}

export interface Conversation {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Use case interfaces
export interface MessagingRepository {
  fetchMessages: (userId: string, partnerId: string) => Promise<Message[]>;
  fetchConversations: (userId: string) => Promise<Conversation[]>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<Message | null>;
  markConversationAsRead: (userId: string, partnerId: string) => Promise<boolean>;
}

// Return types for hooks
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

export interface UseMessagesReturn {
  messages: Message[];
  messagesLoading: boolean;
  fetchMessages: (partnerId: string) => Promise<Message[]>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  error: string | null;
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  conversationsLoading: boolean;
  fetchConversations: () => Promise<Conversation[]>;
  error: string | null;
}
