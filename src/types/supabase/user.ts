
// User-related types for UI components and business logic

import { UserTransaction } from './tables';
import { Referral } from './referral';
import { Expert } from '../expert';
import { Program } from '../programs';

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  currency?: string;
  profile_picture?: string;
  wallet_balance?: number;
  created_at?: string;
  referral_code?: string;
  referred_by?: string;
  referral_link?: string;
  
  // Related data collections
  favorite_experts?: string[];
  favorite_programs?: number[]; // Make sure this property exists
  enrolled_courses?: Course[];
  transactions?: UserTransaction[];
  reviews?: Review[];
  reports?: Report[];
  referrals?: Referral[];
}

export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Report {
  id: string;
  expertId: string;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export interface Course {
  id: string;
  title: string;
  expertId: string;
  expertName: string;
  enrollmentDate: string;
  progress?: number;
  completed?: boolean;
}
