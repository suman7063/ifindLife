
import { Expert } from '../expert';
import { Review, Report } from './reviews';
import { UserTransaction } from './transactions';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  profile_picture?: string;
  wallet_balance?: number;
  currency?: string;
  created_at?: string;
  updated_at?: string;
  referral_code?: string;
  referral_link?: string;
  
  // Related data that might be joined
  favoriteExperts?: Expert[];
  reviews?: Review[];
  reports?: Report[];
  transactions?: UserTransaction[];
}
