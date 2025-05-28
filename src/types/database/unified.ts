
// Unified database types for consistent data handling
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  currency: string;
  profile_picture: string | null;
  wallet_balance: number;
  created_at: string;
  updated_at?: string;
  referred_by: string | null;
  referral_code: string;
  referral_link: string;
  favorite_experts: string[] | number[];
  favorite_programs: string[] | number[];
  enrolled_courses: any[];
  reviews: any[];
  reports: any[];
  transactions: any[];
  referrals: any[];
}

export interface ExpertProfile {
  id: string;
  auth_id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  certificate_urls?: string[];
  profile_picture?: string | null;
  selected_services?: number[];
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  status?: string;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'user' | 'expert' | 'admin' | null;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at?: string;
}
