
// Main index file re-exporting all types from the specialized files
export * from './userProfile';
export * from './userFavorites';
export * from './referral';

// Re-export from tables.ts - use explicit exports to avoid duplicates
export type {
  UserTransaction,
  NewReview,
  NewReport,
  Review,
  Report
} from './tables';

// Re-export from reviews.ts - but not UserReview (it comes from tables.ts)
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

// Ensure UserProfile has all required fields
export interface UserProfile {
  id: string;
  name: string; // Making this required to fix type errors
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  avatar_url?: string;
  profile_picture?: string;
  currency?: string;
  wallet_balance?: number;
  referral_code?: string;
  created_at?: string;
  updated_at?: string;
  favorite_experts?: string[];
  enrolled_courses?: any[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
}

export type { 
  ExpertProfile,
  ExpertReview,
  ExpertService,
  ExpertAvailability
} from './expert';

// Add Referral interface
export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  reward_claimed: boolean;
  created_at?: string;
  completed_at?: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
}

// Add Conversation interface for messaging
export interface Conversation {
  conversationId: string;
  userId: string;
  userName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}
