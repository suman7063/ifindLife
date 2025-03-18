
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
      
      // Fetch updated reviews for this user
      const { data: updatedUserReviews, error: reviewsError } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userProfile.id);
      
      if (reviewsError) throw reviewsError;
      
      if (!updatedUserReviews || updatedUserReviews.length === 0) {
        return { success: true, reviews: [] };
      }
      
      // Prepare a simple array of expert IDs as strings for the query
      const expertIds: string[] = [];
      for (const review of updatedUserReviews) {
        expertIds.push(convertExpertIdToString(review.expert_id));
      }
      
      // Get expert names in a single batch query
      const { data: expertsData, error: expertsError } = await supabase
        .from('experts')
        .select('id, name')
        .in('id', expertIds);
      
      if (expertsError) throw expertsError;
      
      // Create a simple lookup object for expert names
      const expertNames: {[key: string]: string} = {};
      if (expertsData) {
        for (const expert of expertsData) {
          expertNames[expert.id] = expert.name;
        }
      }
      
      // Create formatted reviews array manually
      const formattedReviews: Review[] = [];
      
      // Add each review manually without complex transformations
      for (const dbReview of updatedUserReviews) {
        // Convert ID to string first and store it
        const expertIdStr = convertExpertIdToString(dbReview.expert_id);
        
        // Create a simple review object with manual assignments
        const review: Review = {
          id: dbReview.id,
          expertId: expertIdStr,
          rating: dbReview.rating,
          comment: dbReview.comment || '',
          date: dbReview.date,
          verified: Boolean(dbReview.verified),
          userId: userProfile.id,
          userName: userProfile.name || 'Anonymous User',
          expertName: expertNames[expertIdStr] || 'Unknown Expert'
        };
        
        // Add to array
        formattedReviews.push(review);
      }
      
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
