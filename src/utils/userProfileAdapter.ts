
import { UserProfile } from '@/types/database/unified';
import { UserTransaction } from '@/types/supabase/tables';

/**
 * Adapts database user data to UserProfile type
 * Handles both users and profiles tables
 */
export function adaptUserProfile(data: any): UserProfile {
  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    city: data.city || '',
    country: data.country || '',
    profile_picture: data.profile_picture || '',
    wallet_balance: data.wallet_balance || 0,
    currency: data.currency || 'USD',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at,
    referral_code: data.referral_code || '',
    referral_link: data.referral_link || '',
    referred_by: data.referred_by,
    
    // Initialize arrays to prevent null errors
    transactions: data.transactions || [],
    reviews: data.reviews || [],
    reports: data.reports || [],
    favorite_experts: data.favorite_experts || [],
    favorite_programs: Array.isArray(data.favorite_programs) 
      ? data.favorite_programs.map(String)
      : [],
    enrolled_courses: data.enrolled_courses || [],
    referrals: data.referrals || [],
    
    // Add camelCase aliases
    profilePicture: data.profile_picture,
    walletBalance: data.wallet_balance,
    favoriteExperts: data.favorite_experts,
    enrolledCourses: data.enrolled_courses,
    referralCode: data.referral_code
  };
}

/**
 * Get profile picture URL from any user profile format
 */
export function getProfilePicture(userProfile: any): string {
  return userProfile?.profile_picture || userProfile?.profilePicture || '';
}

/**
 * Adapts transaction data to ensure consistent properties
 */
export function adaptTransaction(transaction: any): UserTransaction {
  return {
    id: transaction.id,
    user_id: transaction.user_id,
    amount: transaction.amount,
    date: transaction.date || transaction.created_at,
    type: transaction.type || 'payment',
    currency: transaction.currency || 'USD',
    description: transaction.description || '',
    transaction_type: transaction.transaction_type || transaction.type || 'payment'
  };
}

/**
 * Adapts review data for consistent access
 */
export function adaptReview(review: any): any {
  return {
    id: review.id,
    user_id: review.user_id,
    expert_id: review.expert_id,
    rating: review.rating,
    comment: review.comment || '',
    date: review.date || review.created_at,
    verified: review.verified || false,
    expert_name: review.expert_name || '',
    user_name: review.user_name || ''
  };
}
