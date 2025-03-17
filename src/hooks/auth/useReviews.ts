
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
      // Convert expertId to number for database storage
      const expertIdNumber = parseInt(expertId);
      
      // Check if user has already reviewed this expert
      const { data: existingReviews } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('expert_id', expertIdNumber);
      
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
            expert_id: expertIdNumber,
            rating,
            comment,
            date: new Date().toISOString(),
            user_name: userProfile.name || 'Anonymous User'
          });
        
        if (error) throw error;
        
        toast.success('Review added successfully');
      }
      
      // Return updated user profile
      const { data: updatedUserReviews } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userProfile.id);
      
      // Get expert names for each review
      const reviewsWithExpertNames = await Promise.all((updatedUserReviews || []).map(async (review) => {
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
      
      // Add updated reviews to the profile
      const updatedProfile = {
        ...userProfile,
        reviews: reviewsWithExpertNames ? reviewsWithExpertNames.map(review => ({
          id: review.id,
          expertId: review.expert_id.toString(),
          rating: review.rating,
          comment: review.comment || '',
          date: review.date,
          verified: review.verified || false,
          userId: review.user_id || '',
          userName: review.user_name || `User ${review.user_id?.slice(0, 8)}...` || 'Anonymous',
          expertName: review.expert_name
        })) : []
      };
      
      return updatedProfile;
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
      // Convert expertId to number for database query
      const expertIdNumber = parseInt(expertId);
      
      const { data: transactions } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('expert_id', expertIdNumber);
      
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
