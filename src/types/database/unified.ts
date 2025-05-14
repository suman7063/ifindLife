
/**
 * Unified type definitions for database entities
 * These types directly match the database schema column names (snake_case)
 */

/**
 * UserProfile type that maps directly to the 'users' table schema
 */
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
  updated_at?: string;
  referred_by?: string;
  referral_code?: string;
  referral_link?: string;
}

/**
 * ExpertProfile type that maps directly to the 'expert_accounts' table schema
 */
export interface ExpertProfile {
  id: string;
  auth_id?: string;
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
  profile_picture?: string;
  certificate_urls?: string[];
  selected_services?: number[];
  status?: 'pending' | 'approved' | 'disapproved';
  created_at?: string;
  updated_at?: string;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
}

/**
 * Utility functions for consistent property access and conversion
 */

/**
 * Get profile picture with consistent property access
 */
export function getProfilePicture(profile: UserProfile | ExpertProfile): string | undefined {
  return profile.profile_picture;
}

/**
 * Get wallet balance with type safety
 */
export function getWalletBalance(profile: UserProfile): number {
  return profile.wallet_balance || 0;
}

/**
 * Type guard to check if a profile is an ExpertProfile
 */
export function isExpertProfile(profile: UserProfile | ExpertProfile): profile is ExpertProfile {
  return 'auth_id' in profile;
}

/**
 * Type guard to check if a profile is a UserProfile
 */
export function isUserProfile(profile: UserProfile | ExpertProfile): profile is UserProfile {
  return 'referral_code' in profile || 'wallet_balance' in profile;
}
