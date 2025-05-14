
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isMine: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  profilePicture?: string;
  lastMessageDate: string;
  unreadCount?: number;
}
