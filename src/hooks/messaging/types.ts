
import { Dispatch, SetStateAction } from 'react';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  isMine?: boolean; // Helper property for UI rendering
  timestamp?: Date; // Computed property for display
}

export interface Conversation {
  id: string; // This is the other user's ID
  name: string;
  profilePicture?: string;
  lastMessage?: string;
  lastMessageDate?: string;
  unreadCount?: number;
  otherUserId?: string; // Alias for id for backward compatibility
}

export interface MessagingHook {
  messages: Message[];
  conversations: Conversation[];
  selectedConversation?: string;
  currentConversation: string | null;
  loading: boolean;
  sending: boolean;
  fetchMessages: (recipientId: string) => Promise<void>;
  sendMessage: (recipientId: string, content: string) => Promise<boolean>;
  fetchConversations: () => Promise<void>;
  setCurrentConversation: Dispatch<SetStateAction<string | null>>;
}
