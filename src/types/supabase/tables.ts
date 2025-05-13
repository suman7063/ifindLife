
export interface Review {
  id: string | number;
  user_id: string;
  expert_id: string | number;
  rating: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
  user_name?: string;
  verified?: boolean;
}

export interface Report {
  id: string | number;
  user_id: string;
  expert_id: string | number;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at?: string;
  updated_at?: string;
}

export type NewReview = Omit<Review, 'id' | 'created_at' | 'updated_at'>;
export type NewReport = Omit<Report, 'id' | 'created_at' | 'updated_at'>;

export interface Conversation {
  id: string | number;
  user_id: string;
  expert_id: string | number;
  last_message?: string;
  updated_at?: string;
  created_at?: string;
  unread_count?: number;
  user_name?: string;
  expert_name?: string;
}

export interface Message {
  id: string | number;
  conversation_id: string | number;
  sender_id: string;
  sender_type: 'user' | 'expert' | 'system';
  content: string;
  created_at?: string;
  read?: boolean;
}
