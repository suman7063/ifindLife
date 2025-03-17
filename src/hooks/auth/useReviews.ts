
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { convertExpertIdToNumber, convertExpertIdToString } from '@/types/supabase/expertId';
import { Review } from '@/types/supabase/reviews';

export const useReviews = () => {
  // Add a review to an expert
  const addReview = async (
    userProfile: UserProfile,
    expertId: string,
    rating: number,
    comment: string
  ): Promise<{success: boolean, reviews: Review[]}> => {
    try {
      // Convert expertId to number for database storage
      const expertIdNumber = convertExpertIdToNumber(expertId);
      
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
          .eq('id', existingReviews[0].id);
        
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
      
      // Return updated reviews for this user
      const { data: updatedUserReviews } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userProfile.id);
      
      if (!updatedUserReviews) {
        return { success: true, reviews: [] };
      }
      
      // Get expert names for each review using a separate query
      const expertIds = updatedUserReviews.map(review => review.expert_id);
      const { data: expertsData } = await supabase
        .from('experts')
        .select('id, name')
        .in('id', expertIds.map(id => convertExpertIdToString(id)));
      
      // Create a map of expert IDs to names for easy lookup
      const expertNameMap = new Map();
      if (expertsData) {
        expertsData.forEach(expert => {
          expertNameMap.set(expert.id, expert.name);
        });
      }
      
      // Create formatted reviews array
      const formattedReviews: Review[] = updatedUserReviews.map(review => {
        const expertIdString = convertExpertIdToString(review.expert_id);
        return {
          id: review.id,
          expertId: expertIdString,
          rating: review.rating,
          comment: review.comment || '',
          date: review.date,
          verified: review.verified || false,
          userId: review.user_id || '',
          userName: userProfile.name || 'Anonymous User',
          expertName: expertNameMap.get(expertIdString) || 'Unknown Expert'
        };
      });
      
      // Return only the success status and reviews
      return {
        success: true,
        reviews: formattedReviews
      };
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast.error(error.message || 'Failed to add review');
      return {
        success: false,
        reviews: []
      };
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
      const expertIdNumber = convertExpertIdToNumber(expertId);
      
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
