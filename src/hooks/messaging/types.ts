
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/database/unified';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface ChatPartner {
  id: string;
  name: string;
  profile_picture?: string;
  unread_count: number;
  last_message?: string;
  last_message_time?: string;
}

export interface MessageFormData {
  content: string;
  receiver_id: string;
}
