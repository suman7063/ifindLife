
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
    // Try to fetch the user profile
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.log("Error fetching user profile, attempting to create one:", error);
      
      // If no profile exists, create one
      const userData = {
        id: user.id,
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        country: user.user_metadata?.country || '',
        city: user.user_metadata?.city || '',
        currency: user.user_metadata?.currency || 'USD',
        wallet_balance: 0,
        profile_picture: user.user_metadata?.avatar_url || '',
      };
      
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();
        
      if (createError) {
        console.error('Error creating user profile:', createError);
        return null;
      }
      
      console.log("Created new profile:", newProfile);
      return convertUserToUserProfile(newProfile);
    }
    
    const userProfile = convertUserToUserProfile(data);
    
    // Fetch additional user data
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
    
    const referralsData = await fetchUserReferrals(user.id);
    
    // Convert to the Referral type format
    userProfile.referrals = referralsData.map(ref => ({
      id: ref.id,
      referrerId: ref.referrerId,
      referredId: ref.referredId,
      referredName: ref.referredName,
      referralCode: ref.referralCode,
      status: ref.status,
      rewardClaimed: ref.rewardClaimed,
      createdAt: ref.createdAt,
      completedAt: ref.completedAt
    }));
    
    return userProfile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};
