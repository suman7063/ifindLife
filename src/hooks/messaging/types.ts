import { Message as AppointmentMessage } from '@/types/appointments';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

// User who can participate in messaging
export interface MessagingUser {
  id: string;
  name?: string;
  email?: string;
  profile_picture?: string;
  role?: string;
  type?: 'expert' | 'user' | 'admin' | string; // Updated to accept string for compatibility
}

// Conversation represents a thread between two users
export interface Conversation {
  id: string;
  otherUser: MessagingUser;
  lastMessage?: {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
  unreadCount: number;
  
  // Backward compatibility properties
  userId?: string;
  userName?: string;
  userAvatar?: string;
  lastMessageTime?: string;
}

// Return type for the useMessages hook
export interface UseMessagesReturn {
  messages: AppointmentMessage[];
  messagesLoading: boolean;
  fetchMessages: (conversationId: string) => Promise<AppointmentMessage[]>;
  setMessages: React.Dispatch<React.SetStateAction<AppointmentMessage[]>>;
  error: string | null;
}

// Return type for the useConversations hook
export interface UseConversationsReturn {
  conversations: Conversation[];
  conversationsLoading: boolean;
  fetchConversations: () => Promise<Conversation[]>;
  error: string | null;
}

// Return type for the main useMessaging hook
export interface UseMessagingReturn {
  messages: AppointmentMessage[];
  conversations: Conversation[];
  loading: boolean;
  messagesLoading: boolean;
  conversationsLoading: boolean;
  error: string | null;
  fetchMessages: (userId: string) => Promise<AppointmentMessage[]>;
  fetchConversations: () => Promise<Conversation[]>;
  sendMessage: (receiverId: string, content: string) => Promise<boolean>;
  markMessageAsRead: (messageId: string) => Promise<boolean>;
  refreshConversations: () => Promise<void>;
  searchUsers: (query: string) => Promise<MessagingUser[]>;
  getMessages: (userId: string) => Promise<AppointmentMessage[]>;
}

// API response format for messages
export interface MessageApiResponse {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Message extends MessageApiResponse {
  // Add any additional fields needed
}

export interface MessageRepositoryInterface {
  getMessages: (userId1: string, userId2: string) => Promise<AppointmentMessage[]>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<AppointmentMessage | null>;
  markAsRead: (messageId: string) => Promise<boolean>;
  searchUsers: (query: string) => Promise<MessagingUser[]>;
  getConversations: (userId: string) => Promise<Conversation[]>;
}
