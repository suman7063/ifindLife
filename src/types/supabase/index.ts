
// Main index file re-exporting all types from the specialized files
export * from './userProfile';
export * from './transactions';
export * from './userFavorites';
export * from './referral';

// Re-export from tables.ts
export type {
  UserTransaction,
  UserReview,
  ContactSubmission
} from './tables';

// Re-export from reviews.ts without UserReview (to prevent duplicate)
export type {
  ReviewStats
} from './reviews';

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
  created_at: string; // Ensure consistency with snake_case
}

export type { 
  ExpertProfile,
  ExpertReview,
  ExpertService,
  ExpertAvailability
} from './expert';
