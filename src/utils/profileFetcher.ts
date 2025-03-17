
import { supabase } from '@/lib/supabase';
import { UserProfile, User, Referral } from '@/types/supabase';
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
      expertId: review.expert_id.toString(),
      rating: review.rating,
      comment: review.comment || '',
      date: review.date,
      verified: review.verified || false,
      userId: review.user_id || '',
      userName: review.user_name || `User ${review.user_id?.slice(0, 8)}...` || 'Anonymous',
      expertName: review.expert_name
    })) : [];
    
    const { data: reports } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id);
      
    // Convert expert_id from number to string during adaptation
    userProfile.reports = reports ? adaptReportsToUI(reports) : [];
    
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
