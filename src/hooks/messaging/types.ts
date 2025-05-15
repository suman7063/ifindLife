
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at?: string;
  
  // UI helpers
  isMine?: boolean;
  timestamp?: Date;
}

export interface Conversation {
  id: string;
  name: string;
  profilePicture?: string;
  lastMessageDate: string;
  unreadCount?: number;
}
