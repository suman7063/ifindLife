
import { useMemo } from 'react';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

/**
 * This hook provides adapter functions to convert between different profile types
 */
export const useProfileTypeAdapter = () => {
  // Convert from database type (snake_case) to UI type (camelCase)
  const toTypeA = useMemo(() => (profile: UserProfile | null) => {
    if (!profile) return null;
    
    // Create a camelCase version of the profile for UI components
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      currency: profile.currency,
      profilePicture: profile.profile_picture,
      walletBalance: profile.wallet_balance,
      created_at: profile.created_at,
      referred_by: profile.referred_by,
      referralCode: profile.referral_code,
      referral_link: profile.referral_link,
      favoriteExperts: profile.favorite_experts,
      favorite_experts: profile.favorite_experts,
      wallet_balance: profile.wallet_balance,
      profile_picture: profile.profile_picture,
      referral_code: profile.referral_code,
      enrolledCourses: profile.enrolled_courses,
      enrolled_courses: profile.enrolled_courses,
      transactions: profile.transactions,
      appointments: profile.appointments,
      reviews: profile.reviews,
      referrals: profile.referrals
    };
  }, []);
  
  // Convert from UI type (camelCase) to database type (snake_case)
  const toTypeB = useMemo(() => (profile: any) => {
    if (!profile) return null;
    
    // Create a snake_case version of the profile for database operations
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      currency: profile.currency,
      profile_picture: profile.profilePicture || profile.profile_picture,
      wallet_balance: profile.walletBalance || profile.wallet_balance,
      created_at: profile.created_at,
      referred_by: profile.referred_by,
      referral_code: profile.referralCode || profile.referral_code,
      referral_link: profile.referral_link,
      favorite_experts: profile.favoriteExperts || profile.favorite_experts,
      enrolled_courses: profile.enrolledCourses || profile.enrolled_courses,
      transactions: profile.transactions,
      appointments: profile.appointments,
      reviews: profile.reviews,
      referrals: profile.referrals
    };
  }, []);
  
  return { toTypeA, toTypeB };
};

export default useProfileTypeAdapter;
