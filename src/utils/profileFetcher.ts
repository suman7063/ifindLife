
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
      
      // Generate a unique referral code for the user
      const referralCode = `${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
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
        profile_picture: userMetadata.avatar_url || '',
        referral_code: referralCode
      };
      
      console.log("Creating new user profile with data:", userData);
      
      // Add retry logic for profile creation
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();
            
          if (createError) {
            console.error(`Error creating user profile (attempt ${retries + 1}):`, createError);
            retries++;
            if (retries === maxRetries) {
              return null;
            }
            // Add a small delay before retrying
            await new Promise(resolve => setTimeout(resolve, 500));
          } else {
            console.log("Created new profile:", newProfile);
            return convertUserToUserProfile(newProfile);
          }
        } catch (innerError) {
          console.error(`Exception in profile creation (attempt ${retries + 1}):`, innerError);
          retries++;
          if (retries === maxRetries) {
            return null;
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      return null;
    }
    
    console.log("Found existing user profile, retrieving full data.");
    const userProfile = convertUserToUserProfile(data);
    
    // Use Promise.allSettled to prevent one failing request from failing everything
    const results = await Promise.allSettled([
      // Fetch user favorites
      supabase.from('user_favorites').select('expert_id').eq('user_id', user.id),
      // Fetch user courses
      supabase.from('user_courses').select('*').eq('user_id', user.id),
      // Fetch user reviews
      supabase.from('user_reviews').select('*').eq('user_id', user.id),
      // Fetch user reports
      supabase.from('user_reports').select('*').eq('user_id', user.id),
      // Fetch user transactions
      supabase.from('user_transactions').select('*').eq('user_id', user.id)
    ]);
    
    // Process favorites if successful
    if (results[0].status === 'fulfilled') {
      const favorites = results[0].value.data;
      if (favorites && favorites.length > 0) {
        const expertIds = favorites.map(fav => fav.expert_id);
        const { data: expertsData } = await supabase
          .from('experts')
          .select('*')
          .in('id', expertIds as any);
          
        userProfile.favoriteExperts = expertsData || [];
      } else {
        userProfile.favoriteExperts = [];
      }
    }
    
    // Process courses if successful
    if (results[1].status === 'fulfilled') {
      userProfile.enrolledCourses = adaptCoursesToUI(results[1].value.data || []);
    } else {
      userProfile.enrolledCourses = [];
    }
    
    // Process reviews if successful
    if (results[2].status === 'fulfilled') {
      userProfile.reviews = adaptReviewsToUI(results[2].value.data || []);
    } else {
      userProfile.reviews = [];
    }
    
    // Process reports if successful
    if (results[3].status === 'fulfilled') {
      userProfile.reports = adaptReportsToUI(results[3].value.data || []);
    } else {
      userProfile.reports = [];
    }
    
    // Process transactions if successful
    if (results[4].status === 'fulfilled') {
      userProfile.transactions = results[4].value.data || [];
    } else {
      userProfile.transactions = [];
    }
    
    // Ensure all users have a referral code
    if (!userProfile.referralCode) {
      const referralCode = `${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      console.log("User missing referral code, generating new one:", referralCode);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ referral_code: referralCode })
        .eq('id', user.id);
        
      if (!updateError) {
        userProfile.referralCode = referralCode;
      } else {
        console.error("Error updating user with referral code:", updateError);
      }
    }
    
    // Fetch user referrals with error handling
    try {
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
    } catch (error) {
      console.error("Error fetching referrals:", error);
      userProfile.referrals = [];
    }
    
    console.log("Profile data retrieval complete");
    return userProfile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};
