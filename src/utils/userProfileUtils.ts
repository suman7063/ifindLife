
import { UserProfile, Expert, Course, Review, Report } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { 
  adaptCoursesToUI, 
  adaptReviewsToUI, 
  adaptReportsToUI 
} from './dataAdapters';

// Function to convert database user object to UserProfile
export const convertUserToUserProfile = (data: any): UserProfile => {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    country: data.country,
    city: data.city,
    currency: data.currency,
    profilePicture: data.profile_picture,
    walletBalance: data.wallet_balance || 0,
    createdAt: data.created_at,
    referralCode: data.referral_code,
    referredBy: data.referred_by,
    referralLink: data.referral_link,
    favoriteExperts: [],
    enrolledCourses: [],
    transactions: [],
    reviews: [],
    reports: [],
    referrals: []
  };
};

// Function to fetch user profile
export const fetchUserProfile = async (user: any): Promise<UserProfile | null> => {
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
        .in('id', expertIds);
        
      userProfile.favoriteExperts = expertsData || [];
    }
    
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Function to update the user profile
export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<boolean> => {
  try {
    // Convert from camelCase to snake_case for the database
    const dbProfile: any = {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      country: profile.country,
      city: profile.city,
      currency: profile.currency,
      profile_picture: profile.profilePicture
    };

    const { error } = await supabase
      .from('users')
      .update(dbProfile)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

// Function to upload and update profile picture
export const updateProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
      
    const publicUrl = data.publicUrl;
    
    // Update user profile with the new profile picture URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: publicUrl })
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

// Function to fetch the user's complete profile with related data
export const fetchUserCompleteProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    // Fetch basic user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      return null;
    }

    if (!userData) {
      return null;
    }

    // Create the base profile object
    const userProfile: UserProfile = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      country: userData.country,
      city: userData.city,
      currency: userData.currency,
      profilePicture: userData.profile_picture,
      walletBalance: userData.wallet_balance,
      createdAt: userData.created_at,
      referralCode: userData.referral_code,
      referredBy: userData.referred_by,
      referralLink: userData.referral_link,
      favoriteExperts: [],
      enrolledCourses: [],
      transactions: [],
      reviews: [],
      reports: [],
      referrals: []
    };

    // Fetch user's favorite experts
    const { data: favoritesData, error: favoritesError } = await supabase
      .from('user_favorites')
      .select('expert_id')
      .eq('user_id', userId);

    if (!favoritesError && favoritesData.length > 0) {
      const expertIds = favoritesData.map(fav => fav.expert_id);
      
      // Now fetch the actual expert data
      const { data: expertsData } = await supabase
        .from('experts')
        .select('*')
        .in('id', expertIds.map(id => id.toString()));
        
      if (expertsData) {
        userProfile.favoriteExperts = expertsData as Expert[];
      }
    }

    // Fetch user's enrolled courses
    const { data: coursesData, error: coursesError } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', userId);

    if (!coursesError && coursesData) {
      userProfile.enrolledCourses = adaptCoursesToUI(coursesData);
    }

    // Fetch user's transactions
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (!transactionsError && transactionsData) {
      userProfile.transactions = transactionsData;
    }

    // Fetch user's reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', userId);

    if (!reviewsError && reviewsData) {
      userProfile.reviews = adaptReviewsToUI(reviewsData);
    }

    // Fetch user's reports
    const { data: reportsData, error: reportsError } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', userId);

    if (!reportsError && reportsData) {
      userProfile.reports = adaptReportsToUI(reportsData);
    }

    return userProfile;
  } catch (error) {
    console.error('Error fetching complete user profile:', error);
    return null;
  }
};
