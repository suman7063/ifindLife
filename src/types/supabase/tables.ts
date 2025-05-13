
// Base user profile type
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  avatar_url?: string;
  currency?: string;
  wallet_balance?: number;
  referral_code?: string;
  created_at?: string;
  updated_at?: string;
  favorite_experts?: string[];
  enrolled_courses?: any[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
  profile_picture?: string;
}

// Expert profile type
export interface ExpertProfile {
  id: string;
  name: string;
  email: string;
  auth_id?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  specialization?: string;
  experience?: string;
  bio?: string;
  profile_picture?: string;
  certificate_urls?: string[];
  selected_services?: number[];
  status?: 'pending' | 'approved' | 'disapproved';
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
}

// Transaction type
export interface UserTransaction {
  id: string;
  user_id?: string;
  amount: number;
  date: string;
  type: string;  // This will be used instead of transaction_type
  currency: string;
  description?: string;
}

// Review type
export interface Review {
  id: string;
  user_id?: string;
  expert_id: number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  user_name?: string;
}

export type NewReview = Omit<Review, 'id' | 'date'>;

// Report type
export interface Report {
  id: string;
  user_id?: string;
  expert_id: number;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export type NewReport = Omit<Report, 'id' | 'date' | 'status'>;

// Referral type
export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: string;
  reward_claimed: boolean;
  created_at?: string;
  completed_at?: string;
}

// Contact submission type
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
