
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { updateReviews, getReviewForExpert, hasServiceFromExpert } from './utils/reviewUtils';

const useReviews = () => {
  const addReview = async (user: UserProfile | null, expertId: string, rating: number, comment: string) => {
    if (!user) {
      toast.error('You must be logged in to leave a review');
      return { success: false, reviews: [] };
    }
    
    try {
      // Check if the user has already taken service from this expert
      const hasService = await hasServiceFromExpert(user.id, expertId);
      
      if (!hasService) {
        toast.error('You can only review experts after consulting with them');
        return { success: false, reviews: [] };
      }
      
      // Check if the user has already reviewed this expert
      const existingReview = await getReviewForExpert(user.id, expertId);
      
      if (existingReview) {
        // Update existing review
        const updatedReviews = await updateReviews(
          user.id,
          expertId,
          rating,
          comment,
          existingReview.id
        );
        
        toast.success('Review updated successfully');
        return { success: true, reviews: updatedReviews };
      } else {
        // Add new review
        const updatedReviews = await updateReviews(
          user.id,
          expertId,
          rating,
          comment
        );
        
        toast.success('Review added successfully');
        return { success: true, reviews: updatedReviews };
      }
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
      return { success: false, reviews: [] };
    }
  };
  
  const hasTakenServiceFrom = async (user: UserProfile | null, expertId: string) => {
    if (!user) return false;
    return await hasServiceFromExpert(user.id, expertId);
  };
  
  return {
    addReview,
    hasTakenServiceFrom
  };
};

export default useReviews;
