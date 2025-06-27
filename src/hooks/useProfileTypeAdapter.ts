
import { UserProfile } from '@/types/database/unified';

export const useProfileTypeAdapter = () => {
  const toTypeA = (profile: any): UserProfile => {
    if (!profile) return null as any;
    
    return {
      ...profile,
      favorite_experts: profile.favorite_experts || [],
      favorite_programs: profile.favorite_programs || [],
      enrolled_courses: profile.enrolled_courses || [],
      reviews: profile.reviews || [],
      recent_activities: profile.recent_activities || [],
      upcoming_appointments: profile.upcoming_appointments || [],
      transactions: profile.transactions || [],
      reports: profile.reports || [],
      referrals: profile.referrals || []
    };
  };

  const toTypeB = (profile: UserProfile): any => {
    if (!profile) return null;
    
    return {
      ...profile
    };
  };

  return {
    toTypeA,
    toTypeB
  };
};
