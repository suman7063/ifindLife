
// Main index file re-exporting all types from the specialized files

export * from './tables';
export * from './userProfile';
export * from './transactions';
export * from './reviews';
export * from './userFavorites';
export * from './referral';

// Define ReferralSettings interface
export interface ReferralSettings {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  description?: string;
  updated_at?: string;
}

// Additional UI-specific types
export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referredName?: string;
  referralCode: string;
  status: string;
  rewardClaimed: boolean;
  createdAt?: string;
  completedAt?: string;
}

export interface UserTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "credit" | "debit" | string;
  status: string;
  description?: string;
  created_at: string;
  payment_id?: string;
  order_id?: string;
  date?: string;
  currency?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  expertId?: string | number;
  expertName?: string;
  enrollmentDate?: string;
  progress?: number;
  completed?: boolean;
}

// For backward compatibility
import type { Expert } from '../expert';
export type { Expert };
export type ExpertProfile = Expert;
