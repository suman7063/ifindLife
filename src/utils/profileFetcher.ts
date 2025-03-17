
import { supabase } from '@/lib/supabase';
import { UserProfile, User } from '@/types/supabase';
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
    
    // Use the new imported adaptor function from utils/referralUtils
    userProfile.referrals = referrals;
    
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
