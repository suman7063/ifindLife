
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';
import { convertUserToUserProfile } from '@/utils/profileConverters';
import { adaptCoursesToUI, adaptReviewsToUI, adaptReportsToUI } from '@/utils/dataAdapters';

// Function to fetch user profile from Supabase
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
    
    // Convert to UserProfile with camelCase properties
    const userProfile = convertUserToUserProfile(data);
    
    // Fetch related data
    // Favorites
    const { data: favorites } = await supabase
      .from('user_favorites')
      .select('expert_id')
      .eq('user_id', user.id);
    
    if (favorites && favorites.length > 0) {
      const expertIds = favorites.map(fav => fav.expert_id);
      const { data: expertsData } = await supabase
        .from('experts')
        .select('*')
        .in('id', expertIds as any); // Using type assertion here
        
      userProfile.favoriteExperts = expertsData || [];
    }
    
    // Courses
    const { data: courses } = await supabase
      .from('user_courses')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.enrolledCourses = adaptCoursesToUI(courses || []);
    
    // Reviews
    const { data: reviews } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.reviews = adaptReviewsToUI(reviews || []);
    
    // Reports
    const { data: reports } = await supabase
      .from('user_reports')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.reports = adaptReportsToUI(reports || []);
    
    // Transactions
    const { data: transactions } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', user.id);
      
    userProfile.transactions = transactions || [];
    
    return userProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
