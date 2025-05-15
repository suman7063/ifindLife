
import { UserProfile } from '@/types/supabase/user';

/**
 * Adapts a user profile from database to ensure all required fields are present
 */
export function adaptUserProfile(profileData: any | null): UserProfile | null {
  if (!profileData) return null;
  
  // Ensure all arrays are defined to prevent type errors
  const favoriteExperts = Array.isArray(profileData.favorite_experts) 
    ? profileData.favorite_experts 
    : [];
    
  const favoritePrograms = Array.isArray(profileData.favorite_programs)
    ? profileData.favorite_programs.map(String)
    : [];
    
  const enrolledCourses = Array.isArray(profileData.enrolled_courses)
    ? profileData.enrolled_courses
    : [];
    
  const reviews = Array.isArray(profileData.reviews)
    ? profileData.reviews
    : [];
    
  const reports = Array.isArray(profileData.reports)
    ? profileData.reports
    : [];
    
  const transactions = Array.isArray(profileData.transactions)
    ? profileData.transactions
    : [];
    
  const referrals = Array.isArray(profileData.referrals)
    ? profileData.referrals
    : [];
  
  // Create a normalized user profile with all required fields
  return {
    id: profileData.id || '',
    name: profileData.name || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    country: profileData.country || '',
    city: profileData.city || '',
    currency: profileData.currency || 'USD',
    profile_picture: profileData.profile_picture || '',
    wallet_balance: typeof profileData.wallet_balance === 'number' ? profileData.wallet_balance : 0,
    created_at: profileData.created_at || new Date().toISOString(),
    referred_by: profileData.referred_by || null,
    referral_code: profileData.referral_code || '',
    referral_link: profileData.referral_link || '',
    favorite_experts: favoriteExperts,
    favorite_programs: favoritePrograms,
    enrolled_courses: enrolledCourses,
    reviews: reviews,
    reports: reports,
    transactions: transactions,
    referrals: referrals
  };
}
