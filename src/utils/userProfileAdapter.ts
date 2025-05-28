
import { UserProfile } from '@/types/database/unified';

// Adapter to ensure user profile compatibility across different formats
export function adaptUserProfile(userData: any): UserProfile | null {
  if (!userData) return null;
  
  return {
    id: userData.id,
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    country: userData.country || '',
    city: userData.city || '',
    currency: userData.currency || 'USD',
    profile_picture: userData.profile_picture || userData.profilePicture || '',
    wallet_balance: userData.wallet_balance || userData.walletBalance || 0,
    created_at: userData.created_at || new Date().toISOString(),
    updated_at: userData.updated_at,
    referred_by: userData.referred_by || null,
    referral_code: userData.referral_code || userData.referralCode || '',
    referral_link: userData.referral_link || userData.referralLink || '',
    favorite_experts: userData.favorite_experts || userData.favoriteExperts || [],
    favorite_programs: userData.favorite_programs || userData.favoritePrograms || [],
    enrolled_courses: userData.enrolled_courses || userData.enrolledCourses || [],
    reviews: userData.reviews || [],
    reports: userData.reports || [],
    transactions: userData.transactions || [],
    referrals: userData.referrals || []
  };
}

// Helper to get user display name safely
export function getUserDisplayName(profile: UserProfile | null): string {
  if (!profile) return 'User';
  return profile.name || profile.email || 'User';
}

// Helper to get wallet balance safely
export function getWalletBalance(profile: UserProfile | null): number {
  if (!profile) return 0;
  return profile.wallet_balance || 0;
}

// Helper to get profile picture safely
export function getProfilePicture(profile: UserProfile | null): string {
  if (!profile) return '';
  return profile.profile_picture || '';
}

// Adapter for transactions to ensure consistent property names
export function adaptTransaction(transaction: any): any {
  if (!transaction) return null;
  
  return {
    ...transaction,
    // Ensure both formats are available
    date: transaction.date || transaction.created_at,
    created_at: transaction.created_at || transaction.date,
    type: transaction.type || transaction.transaction_type,
    transaction_type: transaction.transaction_type || transaction.type
  };
}

// Adapter for reviews to ensure consistent property names
export function adaptReview(review: any): any {
  if (!review) return null;
  
  return {
    ...review,
    expert_name: review.expert_name || review.expertName || 'Unknown Expert',
    expertId: review.expertId || review.expert_id,
    expert_id: review.expert_id || review.expertId
  };
}
