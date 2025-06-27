
import { UserProfile } from '@/types/database/unified';

export function ensureUserProfileCompatibility(profile: any): UserProfile | null {
  if (!profile) return null;
  
  // Convert from snake_case (database) to camelCase (UI) and ensure all required properties
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    country: profile.country,
    city: profile.city,
    currency: profile.currency,
    profile_picture: profile.profile_picture || profile.profilePicture,
    wallet_balance: profile.wallet_balance || profile.walletBalance || 0,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    referred_by: profile.referred_by,
    referral_code: profile.referral_code,
    referral_link: profile.referral_link,
    favorite_experts: profile.favorite_experts || [],
    favorite_programs: profile.favorite_programs || [],
    enrolled_courses: profile.enrolled_courses || [],
    reviews: profile.reviews || [],
    recent_activities: profile.recent_activities || [], // Added missing property
    upcoming_appointments: profile.upcoming_appointments || [], // Added missing property
    reports: profile.reports || [],
    transactions: profile.transactions || [],
    referrals: profile.referrals || []
  };
}

export function normalizeUserProfile(profile: any): UserProfile | null {
  if (!profile) return null;
  
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    country: profile.country,
    city: profile.city,
    currency: profile.currency,
    profile_picture: profile.profile_picture,
    wallet_balance: profile.wallet_balance || 0,
    created_at: profile.created_at,
    referred_by: profile.referred_by,
    referral_code: profile.referral_code,
    referral_link: profile.referral_link,
    favorite_experts: profile.favorite_experts || [],
    favorite_programs: profile.favorite_programs || [],
    enrolled_courses: profile.enrolled_courses || [],
    reviews: profile.reviews || [],
    recent_activities: profile.recent_activities || [], // Added missing property
    upcoming_appointments: profile.upcoming_appointments || [], // Added missing property
    reports: profile.reports || [],
    transactions: profile.transactions || [],
    referrals: profile.referrals || []
  };
}

export function createUserProfileWithDefaults(profile: any): UserProfile {
  return {
    id: profile?.id || '',
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    city: profile?.city || '',
    currency: profile?.currency || 'USD',
    profile_picture: profile?.profile_picture || '',
    wallet_balance: profile?.wallet_balance || 0,
    created_at: profile?.created_at || new Date().toISOString(),
    updated_at: profile?.updated_at,
    referred_by: profile?.referred_by,
    referral_code: profile?.referral_code || '',
    referral_link: profile?.referral_link || '',
    favorite_experts: profile?.favorite_experts || [],
    favorite_programs: profile?.favorite_programs || [],
    enrolled_courses: profile?.enrolled_courses || [],
    reviews: profile?.reviews || [],
    recent_activities: profile?.recent_activities || [], // Added missing property
    upcoming_appointments: profile?.upcoming_appointments || [], // Added missing property
    reports: profile?.reports || [],
    transactions: profile?.transactions || [],
    referrals: profile?.referrals || []
  };
}
