
// User-related types for UI components and business logic

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

// Import necessary types from other files
import { Expert, UserTransaction } from './tables';
import { Referral } from './referral';
