
import { Report } from './index';
import { ReferralUI } from './referrals';
import { Review } from './reviews';
import { Appointment } from './appointments';

// Database schema type (snake_case)
export interface UserProfileDb {
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
}

// UI schema type (camelCase)
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  bio?: string;
  profilePicture?: string;
  lastLogin?: string;
  createdAt?: string;
  walletBalance?: number;
  currency?: string;
  referralCode?: string;
  referralLink?: string;
  referredBy?: string;
  
  // Related collections
  favorites?: string[];
  favoriteExperts?: any[];
  enrolledCourses?: any[];
  transactions?: any[];
  reports?: Report[];
  reviews?: Review[];
  appointments?: Appointment[];
  referrals?: ReferralUI[];
}

export interface UserInsertDb {
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

export interface UserInsert {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  bio?: string;
  profilePicture?: string;
  walletBalance?: number;
  currency?: string;
}

export interface UserUpdateDb extends Partial<UserInsertDb> {
  last_login?: string;
}

export interface UserUpdate extends Partial<UserInsert> {
  lastLogin?: string;
}
