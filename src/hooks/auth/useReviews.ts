
// Fix the expert ID type conversion in the useReviews hook
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

export const useReviews = () => {
  // Add a review to an expert
  const addReview = async (
    userProfile: UserProfile,
    expertId: string,
    rating: number,
    comment: string
  ) => {
    try {
      // Convert expertId to string if it's a number
      const expertIdString = String(expertId);
      
      // Check if user has already reviewed this expert
      const { data: existingReviews } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('expert_id', expertIdString);
      
      if (existingReviews && existingReviews.length > 0) {
        // Update existing review
        const { error } = await supabase
          .from('user_reviews')
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReviews[0].id)
          .select();
        
        if (error) throw error;
        
        toast.success('Review updated successfully');
      } else {
        // Create new review
        const { error } = await supabase
          .from('user_reviews')
          .insert({
            user_id: userProfile.id,
            expert_id: expertIdString,
            rating,
            comment,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        
        toast.success('Review added successfully');
      }
      
      // Return updated user profile
      const { data: updatedUserReviews } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userProfile.id);
      
      return {
        ...userProfile,
        reviews: updatedUserReviews || []
      };
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast.error(error.message || 'Failed to add review');
      return null;
    }
  };
  
  // Check if user has taken service from an expert
  const hasTakenServiceFrom = async (
    userProfile: UserProfile | null,
    expertId: string
  ): Promise<boolean> => {
    if (!userProfile) return false;
    
    try {
      // Convert expertId to string if it's a number
      const expertIdString = String(expertId);
      
      const { data: transactions } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('expert_id', expertIdString);
      
      return !!(transactions && transactions.length > 0);
    } catch (error: any) {
      console.error('Error checking transactions:', error);
      return false;
    }
  };
  
  return {
    addReview,
    hasTakenServiceFrom
  };
};
