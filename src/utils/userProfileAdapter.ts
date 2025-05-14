
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

/**
 * Converts UserProfile from one type to another for backward compatibility
 */
export function adaptUserProfile(profile: UserProfileA | UserProfileB | null): UserProfileA | null {
  if (!profile) return null;
  
  // Convert favorite_programs to string[] if it's number[]
  let favoritePrograms: string[] = [];
  
  if (Array.isArray(profile.favorite_programs)) {
    // Ensure all favorite programs are strings
    favoritePrograms = profile.favorite_programs.map(id => String(id));
  }
  
  // Handle missing required properties in UserProfileB by providing defaults
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
    favorite_experts: Array.isArray(profile.favorite_experts) ? profile.favorite_experts.map(id => String(id)) : [],
    favorite_programs: favoritePrograms,
    enrolled_courses: profile.enrolled_courses || [],
    reviews: profile.reviews || [],
    reports: profile.reports || [],
    transactions: profile.transactions || [],
    referrals: profile.referrals || []
  };
}

/**
 * Helper function to get profile picture with proper type handling
 */
export function getProfilePicture(profile: UserProfileA | UserProfileB | null): string {
  if (!profile) return '';
  return profile.profile_picture || '';
}

/**
 * Helper function to normalize favorite programs to string array
 */
export function normalizeFavoritePrograms(favorites: string[] | number[] | undefined): string[] {
  if (!favorites) return [];
  return favorites.map(id => String(id));
}

/**
 * Convert profile for use with API functions that expect UserProfileB
 */
export function adaptToUserProfileB(profile: UserProfileA): UserProfileB {
  return {
    ...profile,
    // Convert favorite_programs to number[] if needed
    favorite_programs: profile.favorite_programs?.map(id => {
      const numId = Number(id);
      return isNaN(numId) ? 0 : numId;
    }),
    // Add properties that might be expected in UserProfileB
    profilePicture: profile.profile_picture,
    walletBalance: profile.wallet_balance,
    favoriteExperts: profile.favorite_experts,
    enrolledCourses: profile.enrolled_courses,
    referralCode: profile.referral_code
  };
}

/**
 * Normalize an expert ID to string format
 */
export function normalizeExpertId(id: string | number): string {
  return String(id);
}

/**
 * Adapt review data for consistency
 */
export function adaptReview(review: any): any {
  return {
    ...review,
    id: review.id || '',
    expert_id: normalizeExpertId(review.expert_id || ''),
    rating: Number(review.rating) || 0,
    date: review.date || new Date().toISOString(),
    comment: review.comment || '',
    verified: !!review.verified,
    user_name: review.user_name || ''
  };
}
