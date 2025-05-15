
import { UserProfile as UserProfileA } from '@/types/supabase/user';
import { UserProfile as UserProfileB } from '@/types/supabase/userProfile';

/**
 * Hook to handle UserProfile type compatibility issues
 */
export const useProfileTypeAdapter = () => {
  /**
   * Convert UserProfileA to UserProfileB for function parameters that expect UserProfileB
   */
  const toTypeB = (profile: UserProfileA | null): UserProfileB | null => {
    if (!profile) return null;
    
    // Handle favorite_programs conversion from string[] to number[]
    const favoritePrograms = Array.isArray(profile.favorite_programs)
      ? profile.favorite_programs.map(id => {
          const numId = Number(id);
          return isNaN(numId) ? 0 : numId;
        })
      : [];
    
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      city: profile.city,
      country: profile.country,
      profile_picture: profile.profile_picture,
      wallet_balance: profile.wallet_balance,
      currency: profile.currency,
      created_at: profile.created_at,
      updated_at: profile.created_at, // Default to created_at if updated_at is not available
      referral_code: profile.referral_code,
      referral_link: profile.referral_link,
      referred_by: profile.referred_by,
      
      // Convert string[] to number[] for favorite_programs
      favorite_programs: favoritePrograms,
      favorite_experts: profile.favorite_experts,
      
      // Map additional properties for alias access
      profilePicture: profile.profile_picture,
      walletBalance: profile.wallet_balance,
      favoriteExperts: profile.favorite_experts,
      enrolledCourses: profile.enrolled_courses,
      referralCode: profile.referral_code,
      
      // Include the related data
      transactions: profile.transactions || [],
      reviews: profile.reviews || [],
      reports: profile.reports || []
    };
  };

  /**
   * Convert UserProfileB to UserProfileA for function parameters that expect UserProfileA
   */
  const toTypeA = (profile: UserProfileB | null): UserProfileA | null => {
    if (!profile) return null;
    
    // Make sure all required fields have default values
    const name = profile.name || '';
    const email = profile.email || '';
    const phone = profile.phone || '';
    const country = profile.country || '';
    const city = profile.city || '';
    
    // Handle favorite_programs conversion from number[] to string[]
    const favoritePrograms = Array.isArray(profile.favorite_programs)
      ? profile.favorite_programs.map(id => String(id))
      : [];
    
    return {
      id: profile.id,
      name,
      email,
      phone,
      country,
      city,
      currency: profile.currency || 'USD',
      profile_picture: profile.profile_picture || profile.profilePicture || '',
      wallet_balance: profile.wallet_balance || profile.walletBalance || 0,
      created_at: profile.created_at || '',
      referred_by: profile.referred_by || null,
      referral_code: profile.referral_code || profile.referralCode || '',
      referral_link: profile.referral_link || '',
      
      // Convert number[] to string[] for favorite_programs
      favorite_programs: favoritePrograms,
      favorite_experts: Array.isArray(profile.favorite_experts) ? profile.favorite_experts : [],
      enrolled_courses: profile.enrolled_courses || profile.enrolledCourses || [],
      
      // Add required fields that might be missing
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: []  // Default to empty array
    };
  };

  return {
    toTypeA,
    toTypeB
  };
};
