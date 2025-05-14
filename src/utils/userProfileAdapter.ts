
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

/**
 * Converts UserProfile from one type to another for backward compatibility
 */
export function adaptUserProfile(profile: UserProfileA | UserProfileB | null): UserProfileA | null {
  if (!profile) return null;
  
  // Convert favorite_programs to string[] if it's number[]
  const favoritePrograms = Array.isArray(profile.favorite_programs) 
    ? profile.favorite_programs.map(id => String(id))
    : [];
  
  return {
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    country: profile.country || '',
    city: profile.city || '',
    currency: profile.currency || 'USD',
    profile_picture: profile.profile_picture || '',
    wallet_balance: profile.wallet_balance || 0,
    created_at: profile.created_at || '',
    referred_by: profile.referred_by || null,
    referral_code: profile.referral_code || '',
    referral_link: profile.referral_link || '',
    favorite_experts: Array.isArray(profile.favorite_experts) ? profile.favorite_experts : [],
    favorite_programs: favoritePrograms,
    enrolled_courses: profile.enrolled_courses || [],
    reviews: profile.reviews || [],
    reports: profile.reports || [],
    transactions: profile.transactions || [],
    referrals: profile.referrals || []
  };
}

/**
 * Checks if a value is of type UserProfileA
 */
export function isUserProfileA(profile: any): profile is UserProfileA {
  return profile && typeof profile.email === 'string';
}

/**
 * Checks if a value is of type UserProfileB
 */
export function isUserProfileB(profile: any): profile is UserProfileB {
  return profile && profile.email !== undefined;
}
