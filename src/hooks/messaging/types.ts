
export interface MessagingUser {
  id: string;
  name: string;
  profilePicture?: string;
  isOnline?: boolean;
  lastSeen?: Date | string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date | string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  senderName?: string;
  senderProfilePic?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantProfilePic?: string;
  lastMessage?: string;
  lastTimestamp?: Date | string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface MessagingState {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}
