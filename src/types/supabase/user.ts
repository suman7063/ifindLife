
import { Expert, Referral, UserTransaction } from './tables';
import { Course } from './education';
import { ReviewUI as Review, ReportUI as Report } from './reviews';

// UI-friendly interface with camelCase properties
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  currency?: string;
  profilePicture?: string;
  walletBalance?: number;
  createdAt?: string;
  referralCode?: string;
  referredBy?: string;
  referralLink?: string;
  
  // Related data collections
  favoriteExperts?: Expert[];
  enrolledCourses?: Course[];
  transactions?: UserTransaction[];
  reviews?: Review[];
  reports?: Report[];
  referrals?: Referral[]; // This expects Referral type, not ReferralUI
}

// For backward compatibility
export type ExpertProfile = Expert;
