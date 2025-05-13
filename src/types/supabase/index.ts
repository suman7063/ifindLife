
// Re-export all our type definitions
export * from './user';
export * from './userProfile';
export * from './expert';
export * from './tables';
export * from './reviews';
export * from './referral';
export * from './transactions';
export * from './userFavorites';
export * from './courses';

// Export the ReferralSettings interface that many components are looking for
export interface ReferralSettings {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  updated_at: string;
  description?: string;
}

// Export the Review interface that components need
export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
}

// Extend the Referral interface with UI-specific properties
export interface ReferralUI extends Referral {
  referredName?: string;
  referrerName?: string;
  rewardAmount?: number;
  // For backward compatibility
  code?: string;
}

// Make UserProfile available to all components that import from @/types/supabase
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  currency?: string;
  wallet_balance?: number;
  profile_picture?: string;
  referral_code?: string;
  referral_link?: string;
  created_at?: string;
  favorite_experts?: string[];
  favorite_programs?: number[];
}
