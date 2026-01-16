
// Main index file re-exporting all types from the specialized files
export * from './userProfile';
export * from './userFavorites';
export * from './referral';

// Re-export from tables.ts - use explicit exports to avoid duplicates
export type {
  UserTransaction,
  UserReview,
  ContactSubmission
} from './tables';

// Re-export from reviews.ts - but not UserReview (it comes from tables.ts)
export type {
  ReviewStats
} from './reviews';

// Define ReferralSettings interface
export interface ReferralSettings {
  id?: string;
  referrer_reward?: number; // For backward compatibility
  referred_reward?: number; // For backward compatibility
  referrer_reward_inr?: number;
  referrer_reward_eur?: number;
  referred_reward_inr?: number;
  referred_reward_eur?: number;
  active?: boolean;
  description?: string;
  currency?: string;
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
  created_at: string; // Ensure consistency with snake_case
}

// Define Review type for UI purposes
export interface Review {
  id: string;
  expertId: string | number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
}

// Define Report type for UI purposes
export interface Report {
  id: string;
  expertId: string | number;
  reason: string;
  details?: string;
  date: string;
  status: string;
}

export type { 
  ExpertProfile,
  ExpertReview,
  ExpertService,
  ExpertAvailability
} from './expert';
