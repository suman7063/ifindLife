
import { UserProfile } from '@/types/database/unified';

export function adaptUserProfile(user: any): UserProfile | null {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    city: user.city,
    currency: user.currency || 'USD',
    profile_picture: user.profile_picture || user.profilePicture,
    wallet_balance: user.wallet_balance || user.walletBalance || 0,
    created_at: user.created_at,
    updated_at: user.updated_at,
    referred_by: user.referred_by,
    referral_code: user.referral_code || user.referralCode,
    referral_link: user.referral_link,
    favorite_experts: user.favorite_experts || user.favoriteExperts || [],
    favorite_programs: user.favorite_programs || [],
    enrolled_courses: user.enrolled_courses || user.enrolledCourses || [],
    reviews: user.reviews || [],
    recent_activities: user.recent_activities || [],
    upcoming_appointments: user.upcoming_appointments || [],
    reports: user.reports || [],
    transactions: user.transactions || [],
    referrals: user.referrals || []
  };
}
