import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { convertUserToUserProfile } from '@/utils/profileConverters';
import { adaptCoursesToUI, adaptReviewsToUI, adaptReportsToUI } from '@/utils/dataAdapters';
import { fetchUserReferrals } from '@/utils/referralUtils';

export const fetchUserProfile = async (
  user: User
): Promise<UserProfile | null> => {
  if (!user || !user.id) return null;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    const userProfile = convertUserToUserProfile(data);
    
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('expert_id')
      .eq('user_id', user.id);
    
    if (favorites && favorites.length > 0) {
      const expertIds = favorites.map(fav => fav.expert_id);
      const { data: expertsData } = await supabase
        .from('experts')
        .select('*')
        .in('id', expertIds as any);
        
      userProfile.favoriteExperts = expertsData || [];
    }
    
    const { data: courses } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.enrolledCourses = adaptCoursesToUI(courses || []);
    
    const { data: reviews } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.reviews = adaptReviewsToUI(reviews || []);
    
    const { data: reports } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.reports = adaptReportsToUI(reports || []);
    
    const { data: transactions } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.transactions = transactions || [];
    
    const referrals = await fetchUserReferrals(user.id);
    userProfile.referrals = adaptReferralsToUI(referrals);
    
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const convertUserToUserProfile = (
  userData: any
): UserProfile => {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
    favoriteExperts: [],
    enrolledCourses: [],
    reviews: [],
    reports: [],
    transactions: [],
    referrals: []
  };
};

export const adaptReferralsToUI = (
  referrals: any[]
): any[] => {
  return referrals.map(ref => ({
    id: ref.id,
    referrer_id: ref.referrer_id,
    referred_id: ref.referred_id,
    referral_code: ref.referral_code,
    status: ref.status,
    reward_claimed: ref.reward_claimed,
    created_at: ref.created_at,
    completed_at: ref.completed_at
  }));
};
