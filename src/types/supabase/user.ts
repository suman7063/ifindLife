
import { Report } from './index';
import { Referral } from './referrals';
import { Review } from './reviews';
import { Appointment } from './appointments';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  date_of_birth?: string;
  bio?: string;
  profile_picture?: string;
  last_login?: string;
  created_at?: string;
  wallet_balance?: number;
  currency?: string;
  referral_code?: string;
  referral_link?: string;
  referred_by?: string;
  favorites?: string[];
  reports?: Report[];
  reviews?: Review[];
  appointments?: Appointment[];
  referrals?: Referral[];
}

export interface UserInsert {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  date_of_birth?: string;
  bio?: string;
  profile_picture?: string;
  wallet_balance?: number;
  currency?: string;
}

export interface UserUpdate extends Partial<UserInsert> {
  last_login?: string;
}
