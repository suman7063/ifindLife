
import { supabase } from '@/lib/supabase';
import { UserProfile, User, Referral } from '@/types/supabase';
import { convertUserToUserProfile } from '@/utils/profileConverters';
import { adaptCoursesToUI } from '@/utils/dataAdapters';
import { fetchUserReferrals } from '@/utils/referralUtils';
import { convertExpertIdToString } from '@/types/supabase/expertId';

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
      const expertIds = favorites.map(fav => String(fav.expert_id));
      const { data: expertsData } = await supabase
        .from('experts')
        .select('*')
        .in('id', expertIds);
        
      userProfile.favoriteExperts = expertsData || [];
    }
    
    const { data: courses } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id);
      
    // Convert expert_id from number to string during adaptation
    userProfile.enrolledCourses = courses ? adaptCoursesToUI(courses) : [];
    
    const { data: reviews } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', user.id);
    
    // Get expert names for each review
    const reviewsWithExpertNames = await Promise.all((reviews || []).map(async (review) => {
      const { data: expertData } = await supabase
        .from('experts')
        .select('name')
        .eq('id', review.expert_id)
        .single();
      
      return {
        ...review,
        expert_name: expertData?.name || 'Unknown Expert'
      };
    }));
    
    // Convert to UI format with complete data
    userProfile.reviews = reviewsWithExpertNames ? reviewsWithExpertNames.map(review => ({
      id: review.id,
      expertId: convertExpertIdToString(review.expert_id),
      rating: review.rating,
      comment: review.comment || '',
      date: review.date,
      verified: review.verified || false,
      userId: review.user_id || '',
      userName: data.name || `User ${review.user_id?.slice(0, 8)}...` || 'Anonymous User',
      expertName: review.expert_name
    })) : [];
    
    const { data: reports } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id);
      
    // Convert expert_id from number to string for reports
    userProfile.reports = reports ? reports.map(report => ({
      id: report.id,
      expertId: convertExpertIdToString(report.expert_id),
      reason: report.reason,
      details: report.details || '',
      date: report.date,
      status: report.status,
      userId: report.user_id,
      userName: data.name || `User ${report.user_id?.slice(0, 8)}...` || 'Anonymous User'
    })) : [];
    
    const { data: transactions } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.transactions = transactions || [];
    
    const referrals = await fetchUserReferrals(user.id);
    
    // Convert the ReferralUI[] to the format expected by UserProfile.referrals
    userProfile.referrals = referrals.map(ref => ({
      id: ref.id,
      referrer_id: ref.referrerId,
      referred_id: ref.referredId,
      referral_code: ref.referralCode,
      status: ref.status,
      reward_claimed: ref.rewardClaimed,
      created_at: ref.createdAt,
      completed_at: ref.completedAt
    }));
    
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
