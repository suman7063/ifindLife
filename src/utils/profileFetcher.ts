
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { convertUserToUserProfile } from '@/utils/profileConverters';
import { adaptCoursesToUI, adaptReviewsToUI, adaptReportsToUI } from '@/utils/dataAdapters';
import { fetchUserReferrals } from '@/utils/referralUtils';

export const fetchUserProfile = async (
  user: SupabaseUser
): Promise<UserProfile | null> => {
  if (!user || !user.id) {
    console.log("No user provided to fetchUserProfile");
    return null;
  }
  
  try {
    console.log("Fetching profile for user:", user.id);
    
    // Try to fetch the user profile
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.log("Error fetching user profile, attempting to create one:", error);
      
      // Extract relevant metadata for user creation
      const userMetadata = user.user_metadata || {};
      
      // If no profile exists, create one
      const userData = {
        id: user.id,
        name: userMetadata.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        phone: userMetadata.phone || '',
        country: userMetadata.country || '',
        city: userMetadata.city || '',
        currency: 'USD',
        wallet_balance: 0,
        profile_picture: userMetadata.avatar_url || ''
      };
      
      console.log("Creating new user profile with data:", userData);
      
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
    
    console.log("Found existing user profile, retrieving full data.");
    const userProfile = convertUserToUserProfile(data);
    
    // Fetch additional user data
    console.log("Fetching user favorites");
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('expert_id')
      .eq('user_id', user.id);
    
    if (favorites && favorites.length > 0) {
      const expertIds = favorites.map(fav => fav.expert_id);
      console.log("Fetching expert details for favorites:", expertIds);
      const { data: expertsData } = await supabase
        .from('experts')
        .select('*')
        .in('id', expertIds as any);
        
      userProfile.favoriteExperts = expertsData || [];
    }
    
    console.log("Fetching user courses");
    const { data: courses } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.enrolledCourses = adaptCoursesToUI(courses || []);
    
    console.log("Fetching user reviews");
    const { data: reviews } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.reviews = adaptReviewsToUI(reviews || []);
    
    console.log("Fetching user reports");
    const { data: reports } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.reports = adaptReportsToUI(reports || []);
    
    console.log("Fetching user transactions");
    const { data: transactions } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.transactions = transactions || [];
    
    console.log("Fetching user referrals");
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
    
    console.log("Profile data retrieval complete");
    return userProfile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};
