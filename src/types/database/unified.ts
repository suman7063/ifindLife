
// Unified database types for both user and expert profiles

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  country?: string;
  city?: string;
  profile_picture?: string;
  wallet_balance?: number;
  created_at?: string;
  updated_at?: string;
  referred_by?: string;
  referral_code?: string;
  referral_link?: string;
  
  // Optional nested data for joined queries
  favorite_experts?: number[];
  favorite_programs?: string[];
  enrolled_courses?: string[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
}

export interface ExpertProfile {
  id: string | number;
  user_id: string;
  name: string;
  email: string;
  title?: string;
  about?: string;
  biography?: string;
  specialties?: string[];
  languages?: string[];
  education?: any[];
  certifications?: any[];
  experience?: any[];
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  postal_code?: string;
  status?: 'online' | 'offline' | 'busy';
  rating?: number;
  review_count?: number;
  price_per_minute?: number;
  profile_picture?: string;
  cover_image?: string;
  created_at?: string;
  updated_at?: string;
  is_verified?: boolean;
  is_admin?: boolean;
  availability?: any[];
  services?: any[];
  
  // Additional properties
  account_status?: 'pending' | 'approved' | 'rejected' | 'suspended';
  featured?: boolean;
}
