// Main index file re-exporting all types from the specialized files
export * from './userProfile';
export * from './user';
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

// Define UserProfile interface to ensure backward compatibility
export interface UserProfile {
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
  
  // Related data collections
  favorite_experts?: string[];
  favorite_programs?: number[];
  enrolled_courses?: any[];
  transactions?: any[];
  reviews?: any[];
  reports?: any[];
  referrals?: any[];
}

// Define ReferralSettings interface
export interface ReferralSettings {
  id: string;
  referrer_reward: number;
  referred_reward: number;
  active: boolean;
  description?: string;
  updated_at?: string;
}

// Define ReferralUI interface
export interface ReferralUI {
  id: string;
  referrerId: string;
  referredId: string;
  referredName?: string;
  referralCode: string;
  status: string;
  rewardClaimed: boolean;
  created_at: string;
  completed_at?: string;
}

// Define Review type for UI purposes
export interface Review {
  id: string;
  expertId: string | number;
  rating: number;
  comment?: string;
  date: string;
  verified?: boolean;
  user_name?: string;
  expert_name?: string;
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

// Add Database type for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          country: string | null;
          city: string | null;
          wallet_balance: number | null;
          created_at: string | null;
          currency: string | null;
          profile_picture: string | null;
          referral_code: string | null;
          referral_link: string | null;
          referred_by: string | null;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          country?: string | null;
          city?: string | null;
          wallet_balance?: number | null;
          created_at?: string | null;
          currency?: string | null;
          profile_picture?: string | null;
          referral_code?: string | null;
          referral_link?: string | null;
          referred_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          country?: string | null;
          city?: string | null;
          wallet_balance?: number | null;
          created_at?: string | null;
          currency?: string | null;
          profile_picture?: string | null;
          referral_code?: string | null;
          referral_link?: string | null;
          referred_by?: string | null;
        };
      };
      // Other tables would be defined here
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
