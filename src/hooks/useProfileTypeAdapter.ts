
import { UserProfile } from '@/types/database/unified';

// Type adapter utility for handling different UserProfile formats
export const useProfileTypeAdapter = () => {
  // Convert legacy profile formats to unified format
  const toTypeA = (profile: any): UserProfile => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || undefined,
      country: profile.country || undefined,
      city: profile.city || undefined,
      currency: profile.currency || 'USD',
      profile_picture: profile.profile_picture || profile.profilePicture || undefined,
      wallet_balance: profile.wallet_balance || profile.walletBalance || 0,
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: profile.updated_at || undefined,
      referred_by: profile.referred_by || null,
      referral_code: profile.referral_code || '',
      referral_link: profile.referral_link || '',
      favorite_experts: profile.favorite_experts || profile.favoriteExperts || [],
      favorite_programs: profile.favorite_programs || [],
      enrolled_courses: profile.enrolled_courses || profile.enrolledCourses || [],
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || [],
      // Backward compatibility properties
      walletBalance: profile.wallet_balance || profile.walletBalance || 0,
      favoriteExperts: profile.favorite_experts || profile.favoriteExperts || [],
      enrolledCourses: profile.enrolled_courses || profile.enrolledCourses || [],
      profilePicture: profile.profile_picture || profile.profilePicture || undefined
    };
  };

  // Convert unified profile to Type B format
  const toTypeB = (profile: any): UserProfile => {
    if (!profile) return null;
    
    return {
      id: profile.id,
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || undefined,
      country: profile.country || undefined,
      city: profile.city || undefined,
      currency: profile.currency || 'USD',
      profile_picture: profile.profile_picture || profile.profilePicture || undefined,
      wallet_balance: profile.wallet_balance || profile.walletBalance || 0,
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: profile.updated_at || undefined,
      referred_by: profile.referred_by || null,
      referral_code: profile.referral_code || '',
      referral_link: profile.referral_link || '',
      favorite_experts: profile.favorite_experts || profile.favoriteExperts || [],
      favorite_programs: profile.favorite_programs || [],
      enrolled_courses: profile.enrolled_courses || profile.enrolledCourses || [],
      reviews: profile.reviews || [],
      reports: profile.reports || [],
      transactions: profile.transactions || [],
      referrals: profile.referrals || [],
      // Backward compatibility properties
      walletBalance: profile.wallet_balance || profile.walletBalance || 0,
      favoriteExperts: profile.favorite_experts || profile.favoriteExperts || [],
      enrolledCourses: profile.enrolled_courses || profile.enrolledCourses || [],
      profilePicture: profile.profile_picture || profile.profilePicture || undefined
    };
  };

  return { toTypeA, toTypeB };
};
