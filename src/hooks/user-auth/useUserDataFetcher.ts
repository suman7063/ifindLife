
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { 
  convertUserToUserProfile, 
  adaptCoursesToUI, 
  adaptReviewsToUI, 
  adaptReportsToUI 
} from '@/utils/userProfileUtils';

export const useUserDataFetcher = (
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch basic user info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      
      // Convert to UserProfile with both snake_case and camelCase properties
      const userProfile = convertUserToUserProfile(userData);
      
      // Fetch related data
      // Favorites
      const { data: favorites } = await supabase
        .from('user_favorites')
        .select('expert_id')
        .eq('user_id', userId);
      
      if (favorites && favorites.length > 0) {
        const expertIds = favorites.map(fav => fav.expert_id.toString());
        const { data: expertsData } = await supabase
          .from('experts')
          .select('*')
          .in('id', expertIds);
          
        userProfile.favoriteExperts = expertsData || [];
      }
      
      // Courses
      const { data: courses } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', userId);
        
      userProfile.enrolledCourses = adaptCoursesToUI(courses || []);
      
      // Reviews
      const { data: reviews } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userId);
        
      userProfile.reviews = adaptReviewsToUI(reviews || []);
      
      // Reports
      const { data: reports } = await supabase
        .from('user_reports')
        .select('*')
        .eq('user_id', userId);
        
      userProfile.reports = adaptReportsToUI(reports || []);
      
      // Transactions
      const { data: transactions } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userId);
        
      userProfile.transactions = transactions || [];
      
      setCurrentUser(userProfile);
      
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast.error(error.message || 'Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, [setCurrentUser, setLoading]);

  return {
    fetchUserData
  };
};
