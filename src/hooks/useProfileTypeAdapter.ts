
import { UserProfile } from '@/types/database/unified';

export const useProfileTypeAdapter = () => {
  const adaptUserProfile = (data: any): UserProfile => {
    if (!data) return {} as UserProfile;
    
    const profile: UserProfile = {
      id: data.id || '',
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || '',
      country: data.country || '',
      profile_picture: data.profile_picture || '',
      wallet_balance: data.wallet_balance || 0,
      currency: data.currency || 'USD',
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || data.created_at || new Date().toISOString(),
      referral_code: data.referral_code || '',
      referral_link: data.referral_link || '',
      referred_by: data.referred_by || null,
      
      // Collections with empty defaults
      transactions: data.transactions || [],
      reviews: data.reviews || [],
      reports: data.reports || [],
      favorite_experts: data.favorite_experts || [],
      favorite_programs: data.favorite_programs || [],
      enrolled_courses: data.enrolled_courses || [],
      referrals: data.referrals || [],
      
      // Aliases for camelCase access
      profilePicture: data.profile_picture || data.profilePicture || '',
      walletBalance: data.wallet_balance || data.walletBalance || 0,
      favoriteExperts: data.favorite_experts || data.favoriteExperts || [],
      referralCode: data.referral_code || data.referralCode || '',
    };
    
    return profile;
  };
  
  return {
    adaptUserProfile
  };
};
