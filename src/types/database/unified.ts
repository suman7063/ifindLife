
/**
 * Unified database type definitions
 * These types should match the database schema structure
 */

export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  currency?: string;
  wallet_balance?: number;
  profile_picture?: string | null;
  created_at?: string | null;
  referred_by?: string | null;
  referral_code?: string | null;
  referral_link?: string | null;
  
  // Additional fields that were added to the UserProfile interface
  favorite_experts?: Array<number | string> | null;
  favorite_programs?: Array<number | string> | null;
  enrolled_courses?: Array<any> | null;
  reviews?: Array<any> | null;
  reports?: Array<any> | null;
  transactions?: Array<any> | null;
  referrals?: Array<any> | null;
}

export interface ExpertProfile {
  id: string | number;
  auth_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  specialization?: string | null;
  experience?: string | null;
  bio?: string | null;
  certificate_urls?: string[] | null;
  selected_services?: number[] | null;
  average_rating?: number | null;
  reviews_count?: number | null;
  verified?: boolean | null;
  created_at?: string | null;
  profile_picture?: string | null;
  status?: string | null;
}

export interface TimeSlot {
  id: string;
  day_of_week?: number | null;
  availability_id: string;
  start_time: string;
  end_time: string;
  specific_date?: string | null;
  is_booked?: boolean;
  created_at?: string;
}

export interface Availability {
  id: string;
  expert_id: string;
  start_date: string;
  end_date: string;
  created_at?: string;
  availability_type: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  expert_id: string;
  duration: number;
  service_id?: number;
  uid?: number;
  created_at: string;
  start_time?: string;
  end_time?: string;
  time_slot_id?: string;
  expert_name: string;
  appointment_date: string;
  status: string;
  notes?: string;
  channel_name?: string;
  token?: string;
  google_calendar_event_id?: string;
  user_calendar_event_id?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  other_user: {
    id: string;
    name: string;
    profile_picture?: string;
  };
}

export type MessagingUser = {
  id: string;
  name: string;
  profile_picture?: string;
  isOnline?: boolean;
};
