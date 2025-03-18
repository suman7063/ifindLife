
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
      
      // Fetch all reviews from this user
      const { data: updatedReviews, error: reviewsError } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userProfile.id);
      
      if (reviewsError) throw reviewsError;
      
      // Early return if no reviews
      if (!updatedReviews || updatedReviews.length === 0) {
        return {
          success: true,
          reviews: []
        };
      }
      
      // Extract unique expert IDs as numbers
      const expertIdNumbers: number[] = [];
      updatedReviews.forEach(review => {
        if (!expertIdNumbers.includes(review.expert_id)) {
          expertIdNumbers.push(review.expert_id);
        }
      });
      
      // Convert IDs to strings for the query - do this separately
      const expertIdStrings: string[] = [];
      expertIdNumbers.forEach(idNumber => {
        expertIdStrings.push(convertExpertIdToString(idNumber));
      });
      
      // Get expert data
      const { data: experts } = await supabase
        .from('experts')
        .select('id, name')
        .in('id', expertIdStrings);
      
      // Create a simple lookup object
      const expertNameMap: {[key: string]: string} = {};
      
      if (experts) {
        experts.forEach(expert => {
          expertNameMap[expert.id] = expert.name;
        });
      }
      
      // Create the reviews array manually
      const formattedReviews: Review[] = [];
      
      updatedReviews.forEach(dbReview => {
        const expertIdStr = convertExpertIdToString(dbReview.expert_id);
        
        // Build the review object with direct property assignments
        const review: Review = {
          id: dbReview.id,
          expertId: expertIdStr,
          rating: dbReview.rating,
          comment: dbReview.comment || '',
          date: dbReview.date,
          verified: Boolean(dbReview.verified),
          userId: userProfile.id,
          userName: userProfile.name || 'Anonymous User',
          expertName: expertNameMap[expertIdStr] || 'Unknown Expert'
        };
        
        formattedReviews.push(review);
      });
      
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
