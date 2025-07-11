// Unified types for the application
export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  currency: string | null;
  profile_picture: string | null;
  referral_code: string | null;
  referral_link: string | null;
  referred_by: string | null;
  wallet_balance: number | null;
  created_at: string | null;
  updated_at?: string;
  
  // New fields from updated schema (optional for backward compatibility)
  date_of_birth?: string | null;
  gender?: string | null;
  occupation?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  preferences?: any;
  terms_accepted?: boolean | null;
  privacy_accepted?: boolean | null;
  marketing_consent?: boolean | null;
  
  // Additional properties for user dashboard - all optional to handle partial data
  favorite_experts?: string[];
  favorite_programs?: number[];
  enrolled_courses?: any[];
  reviews?: any[];
  recent_activities?: any[];
  upcoming_appointments?: any[];
  transactions?: any[];
  reports?: any[];
  referrals?: any[];
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  currency?: string;
  profile_picture?: string;
}

export interface ExpertProfile {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties: string[];
  experience_years: number;
  hourly_rate: number;
  status: 'pending' | 'approved' | 'disapproved';
  profile_picture?: string;
  profilePicture?: string; // For backward compatibility
  created_at: string;
  updated_at: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  certificate_urls?: string[];
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
}

export interface AdminProfile {
  id: string;
  role: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
  // UI-specific properties
  isMine?: boolean;
  timestamp?: Date;
}

export interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  name: string; // Made required instead of optional
  profilePicture?: string;
  last_message: string;
  lastMessage?: string;
  last_message_time: string;
  lastMessageDate: string;
  unread_count: number;
  unreadCount?: number;
}

// Re-export from user types to maintain compatibility
export * from './user';
