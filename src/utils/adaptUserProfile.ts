
import { UserProfile } from '@/types/supabase/user';

/**
 * Adapts different user profile formats to ensure consistent access to profile properties
 * This helps handle cases where the user object might come from different sources
 */
export function adaptUserProfile(user: any): UserProfile {
  if (!user) return {
    id: '',
    name: 'User',
    email: '',
    phone: '',
    country: '',
    city: '',
    profile_picture: '',
    wallet_balance: 0,
    created_at: '',
    referred_by: null,
    referral_code: '',
    referral_link: '',
    favorite_experts: [],
    favorite_programs: [],
    enrolled_courses: [],
    currency: '$',
    reviews: [],
    reports: [],
    transactions: [],
    referrals: []
  };
  
  return {
    id: user.id || '',
    name: user.name || user.displayName || user.username || 'User',
    email: user.email || '',
    phone: user.phone || '',
    country: user.country || '',
    city: user.city || '',
    profile_picture: user.profile_picture || user.avatar || '',
    wallet_balance: user.wallet_balance || 0,
    created_at: user.created_at || '',
    referred_by: user.referred_by || null,
    referral_code: user.referral_code || '',
    referral_link: user.referral_link || '',
    favorite_experts: user.favorite_experts || [],
    favorite_programs: user.favorite_programs || [],
    enrolled_courses: user.enrolled_courses || [],
    currency: user.currency || '$',
    reviews: user.reviews || [],
    reports: user.reports || [],
    transactions: user.transactions || [],
    referrals: user.referrals || []
    // Optional properties will be undefined if not provided
    // but we've covered all required properties
  };
}
