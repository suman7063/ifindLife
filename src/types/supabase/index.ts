
// Main index file re-exporting all types from the specialized files

export * from './tables';
export * from './userProfile';
export * from './transactions';
export * from './reviews';
export * from './userFavorites';
export * from './referral';

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

// For backward compatibility
import { Expert } from '../expert';
export type ExpertProfile = Expert;
