
// This file defines custom table types for Supabase

export interface CustomTable {
  experts: {
    id: string;
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
    profile_picture?: string;
    selected_services?: number[];
    created_at?: string;
    rating?: number; // Added for expert ratings
    average_rating?: number; // Cached average rating
    reviews_count?: number; // Count of reviews
  };
  expert_reports: {
    id: string;
    expert_id?: string;
    user_id?: string;
    user_name?: string;
    reason?: string;
    details?: string;
    date?: string;
    status?: string;
  };
  users: {
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
  };
  user_favorites: {
    id: string;
    user_id?: string;
    expert_id: string;
  };
  user_transactions: {
    id: string;
    user_id?: string;
    date: string;
    type: string;
    amount: number;
    currency: string;
    description?: string;
  };
  user_reviews: {
    id: string;
    user_id?: string;
    expert_id: string;
    rating: number;
    comment?: string;
    date: string;
    verified?: boolean; // Added for verified reviews
  };
  user_reports: {
    id: string;
    user_id?: string;
    expert_id: string;
    reason: string;
    details?: string;
    date: string;
    status: string;
  };
  user_courses: {
    id: string;
    user_id?: string;
    title: string;
    expert_id: string;
    expert_name: string;
    enrollment_date: string;
    progress?: number;
    completed?: boolean;
  };
  services: {
    id: number;
    name: string;
    description?: string;
    rate_usd: number;
    rate_inr: number;
  };
  referral_settings: {
    id: string;
    referrer_reward: number;
    referred_reward: number;
    active: boolean;
    description?: string;
    updated_at?: string;
  };
  referrals: {
    id: string;
    referrer_id: string;
    referred_id: string;
    referral_code: string;
    status: string;
    reward_claimed: boolean;
    created_at?: string;
    completed_at?: string;
  };
  user_expert_services: {
    id: string;
    user_id: string;
    expert_id: string;
    service_id: number;
    amount: number;
    status: string;
    created_at: string;
  };
}

// Direct type definitions from database tables
export type Expert = CustomTable['experts'];
export type User = CustomTable['users'];
export type UserTransaction = CustomTable['user_transactions'];
export type ReferralSettings = CustomTable['referral_settings'];
export type Referral = CustomTable['referrals'];
export type UserExpertService = CustomTable['user_expert_services'];

// UI-friendly interfaces with camelCase properties
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

// Using interfaces for UI-friendly models
export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
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

// For referral program
export interface ReferralSettingsUI {
  referrerReward: number;
  referredReward: number;
  active: boolean;
  description?: string;
}

export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referredName?: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'expired';
  rewardClaimed: boolean;
  createdAt?: string;
  completedAt?: string;
}

// For backward compatibility
export type ExpertProfile = Expert;
