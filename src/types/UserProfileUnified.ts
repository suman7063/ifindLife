
/**
 * Unified UserProfile interface that merges all variations across the app
 * This will ensure consistent typing across components
 */
export interface UserProfileUnified {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  
  // Handle profile picture with both naming conventions
  profile_picture?: string;
  avatar_url?: string;
  
  // Wallet properties
  wallet_balance?: number;
  currency?: string;
  
  // Referral properties
  referral_code?: string;
  referral_link?: string;
  referred_by?: string;
  
  // Collection properties
  favorite_experts?: string[];
  favorite_programs?: number[];
  enrolled_courses?: any[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: any[];
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

// Helper function to normalize profile data
export function normalizeUserProfile(profile: any): UserProfileUnified {
  if (!profile) return {
    id: '',
    name: '',
    email: '',
  };
  
  return {
    id: profile.id || '',
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone,
    country: profile.country,
    city: profile.city,
    profile_picture: profile.profile_picture || profile.avatar_url,
    avatar_url: profile.avatar_url || profile.profile_picture,
    wallet_balance: profile.wallet_balance || 0,
    currency: profile.currency || 'USD',
    referral_code: profile.referral_code,
    referral_link: profile.referral_link,
    referred_by: profile.referred_by,
    favorite_experts: Array.isArray(profile.favorite_experts) ? profile.favorite_experts : [],
    favorite_programs: Array.isArray(profile.favorite_programs) ? profile.favorite_programs : [],
    enrolled_courses: Array.isArray(profile.enrolled_courses) ? profile.enrolled_courses : [],
    reviews: Array.isArray(profile.reviews) ? profile.reviews : [],
    reports: Array.isArray(profile.reports) ? profile.reports : [],
    transactions: Array.isArray(profile.transactions) ? profile.transactions : [],
    referrals: Array.isArray(profile.referrals) ? profile.referrals : [],
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
}

// Getter function for profile picture to handle different naming conventions
export function getProfilePicture(profile: UserProfileUnified | null): string | undefined {
  if (!profile) return undefined;
  return profile.profile_picture || profile.avatar_url;
}
