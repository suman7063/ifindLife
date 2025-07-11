
import { UserProfile } from '@/types/database/unified';

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
    currency: 'USD',
    created_at: '',
    referred_by: null,
    referral_code: '',
    referral_link: '',
    date_of_birth: null,
    gender: null,
    occupation: null,
    preferences: {},
    terms_accepted: false,
    privacy_accepted: false,
    marketing_consent: false,
    favorite_experts: [],
    favorite_programs: [],
    enrolled_courses: [],
    reviews: [],
    reports: [],
    transactions: [],
    referrals: [],
    recent_activities: [],
    upcoming_appointments: []
  };
  
  return {
    id: user.id || '',
    name: user.name || user.displayName || user.username || 'User',
    email: user.email || '',
    phone: user.phone || '',
    country: user.country || '',
    city: user.city || '',
    currency: user.currency || 'USD',
    profile_picture: user.profile_picture || user.avatar || '',
    wallet_balance: user.wallet_balance || 0,
    created_at: user.created_at || '',
    referred_by: user.referred_by || null,
    referral_code: user.referral_code || '',
    referral_link: user.referral_link || '',
    date_of_birth: user.date_of_birth || null,
    gender: user.gender || null,
    occupation: user.occupation || null,
    preferences: user.preferences || {},
    terms_accepted: user.terms_accepted || false,
    privacy_accepted: user.privacy_accepted || false,
    marketing_consent: user.marketing_consent || false,
    favorite_experts: user.favorite_experts || [],
    favorite_programs: user.favorite_programs || [],
    enrolled_courses: user.enrolled_courses || [],
    reviews: user.reviews || [],
    reports: user.reports || [],
    transactions: user.transactions || [],
    referrals: user.referrals || [],
    recent_activities: user.recent_activities || [],
    upcoming_appointments: user.upcoming_appointments || []
  };
}
