
import { UserTransaction } from './tables';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  profile_picture?: string;
  wallet_balance?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  
  // Related data
  transactions?: UserTransaction[];
  reviews?: any[];
  reports?: any[];
  favorite_experts?: string[];
  enrolled_courses?: any[];
  referral_code?: string;
  referrals?: any[];
}
