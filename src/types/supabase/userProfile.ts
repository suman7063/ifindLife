
import { Referral } from './referral';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  profile_picture?: string;
  avatar_url?: string;
  currency?: string;
  wallet_balance?: number;
  referral_code?: string;
  created_at?: string;
  updated_at?: string;
  
  // Related collections
  favorite_experts?: string[];
  enrolled_courses?: any[];
  reviews?: any[];
  reports?: any[];
  transactions?: any[];
  referrals?: Referral[];
}

// Helper functions for compatibility
export function mapUserProfileFields(profile: any): UserProfile {
  return {
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone,
    country: profile.country,
    city: profile.city,
    profile_picture: profile.profile_picture || profile.avatar_url,
    avatar_url: profile.avatar_url || profile.profile_picture,
    currency: profile.currency || 'USD',
    wallet_balance: profile.wallet_balance || 0,
    referral_code: profile.referral_code,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    favorite_experts: Array.isArray(profile.favorite_experts) ? profile.favorite_experts : [],
    enrolled_courses: Array.isArray(profile.enrolled_courses) ? profile.enrolled_courses : [],
    reviews: Array.isArray(profile.reviews) ? profile.reviews : [],
    reports: Array.isArray(profile.reports) ? profile.reports : [],
    transactions: Array.isArray(profile.transactions) ? profile.transactions : [],
    referrals: Array.isArray(profile.referrals) ? profile.referrals : [],
  };
}
