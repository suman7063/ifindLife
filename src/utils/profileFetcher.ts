
import { supabase } from '@/lib/supabase';
import { UserProfile, User, Referral, ReferralUI } from '@/types/supabase';
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
    userProfile.enrolledCourses = courses ? courses.map(course => ({
      id: course.id,
      title: course.title,
      expertId: course.expert_id.toString(),
      expertName: course.expert_name,
      enrollmentDate: course.enrollment_date,
      progress: course.progress,
      completed: course.completed
    })) : [];
    
    const { data: reviews } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', user.id);
      
    // Convert expert_id from number to string during adaptation
    userProfile.reviews = reviews ? reviews.map(review => ({
      id: review.id,
      expertId: review.expert_id.toString(),
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      verified: review.verified,
      userId: review.user_id,
      userName: review.user_id ? `User ${review.user_id.slice(0, 8)}...` : undefined
    })) : [];
    
    const { data: reports } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id);
      
    // Convert expert_id from number to string during adaptation
    userProfile.reports = reports ? reports.map(report => ({
      id: report.id,
      expertId: report.expert_id.toString(),
      reason: report.reason,
      details: report.details,
      date: report.date,
      status: report.status
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
