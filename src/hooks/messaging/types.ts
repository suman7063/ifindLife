
export interface MessagingUser {
  id: string;  // Changed from string | number to just string for compatibility
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  role?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  userId: string;  // ID of the other user in the conversation
  userName: string;  // Name of the other user
  userAvatar?: string;  // Avatar of the other user
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
  lastMessageTime: string;
  unreadCount: number;
  otherUser: MessagingUser;  // Added to fix type error
}

export interface MessagingState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}
