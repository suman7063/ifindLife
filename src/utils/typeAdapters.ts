import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';
import { UserProfile } from '@/types/database/unified';

// Ensure user profile compatibility for components expecting different formats
export function ensureUserProfileCompatibility(profile: any): UserProfileA | null {
  if (!profile) return null;
  
  // If it's already in the expected format, return as is
  if ('profilePicture' in profile || 'walletBalance' in profile) {
    return profile as UserProfileA;
  }
  
  // Convert from unified format to UserProfileA
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    country: profile.country,
    city: profile.city,
    currency: profile.currency,
    profile_picture: profile.profile_picture,
    wallet_balance: profile.wallet_balance,
    created_at: profile.created_at,
    referred_by: profile.referred_by,
    referral_code: profile.referral_code,
    referral_link: profile.referral_link,
    favorite_experts: profile.favorite_experts || [],
    favorite_programs: profile.favorite_programs || [],
    enrolled_courses: profile.enrolled_courses || [],
    reviews: profile.reviews || [],
    reports: profile.reports || [],
    transactions: profile.transactions || [],
    referrals: profile.referrals || [],
    // Add camel case aliases
    profilePicture: profile.profile_picture,
    walletBalance: profile.wallet_balance,
    favoriteExperts: profile.favorite_experts || []
  };
}

// Convert to UserProfileB format
export function toUserProfileB(profile: any): UserProfileB | null {
  if (!profile) return null;
  
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    country: profile.country,
    city: profile.city,
    currency: profile.currency,
    profile_picture: profile.profile_picture || profile.profilePicture,
    wallet_balance: profile.wallet_balance || profile.walletBalance,
    created_at: profile.created_at,
    referred_by: profile.referred_by,
    referral_code: profile.referral_code || profile.referralCode,
    referral_link: profile.referral_link || profile.referralLink,
    favorite_experts: profile.favorite_experts || profile.favoriteExperts || [],
    favorite_programs: profile.favorite_programs || profile.favoritePrograms || [],
    enrolled_courses: profile.enrolled_courses || profile.enrolledCourses || [],
    reviews: profile.reviews || [],
    reports: profile.reports || [],
    transactions: profile.transactions || [],
    referrals: profile.referrals || []
  };
}

// Convert to unified format
export function toUnifiedProfile(profile: any): UserProfile | null {
  if (!profile) return null;
  
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    country: profile.country,
    city: profile.city,
    currency: profile.currency,
    profile_picture: profile.profile_picture || profile.profilePicture,
    wallet_balance: profile.wallet_balance || profile.walletBalance,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    referred_by: profile.referred_by,
    referral_code: profile.referral_code || profile.referralCode,
    referral_link: profile.referral_link || profile.referralLink,
    favorite_experts: profile.favorite_experts || profile.favoriteExperts || [],
    favorite_programs: profile.favorite_programs || profile.favoritePrograms || [],
    enrolled_courses: profile.enrolled_courses || profile.enrolledCourses || [],
    reviews: profile.reviews || [],
    reports: profile.reports || [],
    transactions: profile.transactions || [],
    referrals: profile.referrals || []
  };
}

// Handle different user profile formats
export function adaptUserProfile(user: any): UserProfile | null {
  if (!user) return null;
  
  // Handle different user profile formats
  const baseProfile = {
    id: user.id,
    name: user.name || user.full_name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    city: user.city,
    currency: user.currency || 'USD',
    profile_picture: user.profile_picture || user.profilePicture,
    wallet_balance: user.wallet_balance || user.walletBalance || 0,
    created_at: user.created_at,
    updated_at: user.updated_at,
    referred_by: user.referred_by,
    referral_code: user.referral_code || user.referralCode,
    referral_link: user.referral_link,
    // Ensure all arrays are present
    favorite_experts: user.favorite_experts || user.favoriteExperts || [],
    favorite_programs: user.favorite_programs || [],
    enrolled_courses: user.enrolled_courses || user.enrolledCourses || [],
    reviews: user.reviews || [],
    recent_activities: user.recent_activities || [], // Add missing property
    upcoming_appointments: user.upcoming_appointments || [], // Add missing property
    reports: user.reports || [],
    transactions: user.transactions || [],
    referrals: user.referrals || []
  };
  
  return baseProfile;
}
