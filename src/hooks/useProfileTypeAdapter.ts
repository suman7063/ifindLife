
import { useCallback } from 'react';
import { UserProfile } from '@/types/database/unified';

/**
 * Hook to provide adapters for converting between different user profile formats
 */
export const useProfileTypeAdapter = () => {
  // Convert from unified type to specific format
  const toTypeA = useCallback((profile: UserProfile | null): any => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      city: profile.city || '',
      country: profile.country || '',
      profilePicture: profile.profile_picture || '',
      walletBalance: profile.wallet_balance || 0,
      currency: profile.currency || 'USD',
      createdAt: profile.created_at || new Date().toISOString(),
      referralCode: profile.referral_code || '',
      referralLink: profile.referral_link || '',
      referredBy: profile.referred_by || null,
      favoriteExperts: profile.favorite_experts || [],
      favoritePrograms: profile.favorite_programs || [],
      enrolledCourses: profile.enrolled_courses || [],
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || []
    };
  }, []);
  
  // Convert to unified type from type B
  const toTypeB = useCallback((profile: UserProfile | null): any => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      city: profile.city || '',
      country: profile.country || '',
      profile_picture: profile.profile_picture || '',
      wallet_balance: profile.wallet_balance || 0,
      currency: profile.currency || 'USD',
      created_at: profile.created_at || new Date().toISOString(),
      referral_code: profile.referral_code || '',
      referral_link: profile.referral_link || '',
      referred_by: profile.referred_by || null,
      favorite_experts: profile.favorite_experts || [],
      favorite_programs: profile.favorite_programs || [],
      enrolled_courses: profile.enrolled_courses || [],
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || []
    };
  }, []);
  
  return { toTypeA, toTypeB };
};
