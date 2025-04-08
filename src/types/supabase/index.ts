
// Main index file re-exporting all types from the specialized files

export * from './tables';
export * from './userProfile';
// Export transactions without UserTransaction which is already exported from tables
export type { } from './transactions';
export * from './reviews';
export * from './userFavorites';
export * from './referral';
export type { 
  ExpertProfile,
  ExpertReview,
  ExpertService,
  ExpertAvailability
} from './expert';

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
