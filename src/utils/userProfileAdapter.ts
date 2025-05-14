
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
    favoritePrograms = profile.favorite_programs.map(id => String(id));
  }
  
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
 * Adapts a transaction to ensure it has both date and created_at properties
 * as well as type and transaction_type properties
 */
export function adaptTransaction(transaction: any): any {
  if (!transaction) return null;
  
  return {
    ...transaction,
    date: transaction.date || transaction.created_at,
    created_at: transaction.created_at || transaction.date,
    type: transaction.type || transaction.transaction_type,
    transaction_type: transaction.transaction_type || transaction.type
  };
}

/**
 * Adapts a review to ensure it has both expert_id and expertId properties
 */
export function adaptReview(review: any): any {
  if (!review) return null;
  
  return {
    ...review,
    expert_id: review.expert_id || review.expertId,
    expertId: review.expertId || review.expert_id
  };
}

/**
 * Converts expert ID strings to numbers when needed
 */
export function normalizeExpertId(expertId: string | number): number {
  return typeof expertId === 'string' ? parseInt(expertId, 10) : expertId;
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
