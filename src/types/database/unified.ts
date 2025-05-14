
// Unified database type definitions
export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  currency: string;
  profile_picture: string | null;
  wallet_balance: number;
  created_at: string | null;
  referred_by?: string | null;
  referral_code?: string | null;
  referral_link?: string | null;
  
  // Additional fields for backward compatibility
  favorite_experts: string[];
  favorite_programs?: number[];
  enrolled_courses?: any[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
}

export interface ExpertProfile {
  id: string;
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
  certificate_urls?: string[];
  profile_picture?: string | null;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  created_at?: string | null;
  status?: string;
}

export interface TimeSlot {
  id: string;
  availability_id: string;
  start_time: string;
  end_time: string;
  day_of_week?: number | null;
  specific_date?: string | null;
  is_booked?: boolean;
  created_at?: string | null;
}

export interface Availability {
  id: string;
  expert_id: string;
  start_date: string;
  end_date: string;
  availability_type: string;
  created_at?: string | null;
  time_slots?: TimeSlot[];
}

export interface Appointment {
  id: string;
  user_id: string;
  expert_id: string;
  duration: number;
  service_id?: number | null;
  uid?: number | null;
  created_at: string;
  start_time?: string | null;
  end_time?: string | null;
  time_slot_id?: string | null;
  expert_name: string;
  appointment_date: string;
  status: string;
  notes?: string | null;
  channel_name?: string | null;
  token?: string | null;
  google_calendar_event_id?: string | null;
  user_calendar_event_id?: string | null;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export type MessagingUser = {
  id: string | number;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  role?: string;
};
