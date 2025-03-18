
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
      
      // Fetch updated reviews for this user - simplified approach to avoid deep type instantiation
      const { data: updatedReviews, error: reviewsError } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userProfile.id);
      
      if (reviewsError) throw reviewsError;
      
      // Create a simple array to store formatted reviews
      const formattedReviews: Review[] = [];
      
      if (updatedReviews && updatedReviews.length > 0) {
        // Get all expert IDs for a single batch query
        const expertIds: number[] = [];
        for (const review of updatedReviews) {
          if (!expertIds.includes(review.expert_id)) {
            expertIds.push(review.expert_id);
          }
        }
        
        // Get expert names in a single batch query
        const { data: experts } = await supabase
          .from('experts')
          .select('id, name')
          .in('id', expertIds.map(id => convertExpertIdToString(id)));
        
        // Create a lookup map for expert names
        const expertNameMap: Record<string, string> = {};
        if (experts) {
          for (const expert of experts) {
            expertNameMap[expert.id] = expert.name;
          }
        }
        
        // Map reviews to the UI format avoiding complex transformations
        for (const dbReview of updatedReviews) {
          const expertIdStr = convertExpertIdToString(dbReview.expert_id);
          formattedReviews.push({
            id: dbReview.id,
            expertId: expertIdStr,
            rating: dbReview.rating,
            comment: dbReview.comment || '',
            date: dbReview.date,
            verified: Boolean(dbReview.verified),
            userId: userProfile.id,
            userName: userProfile.name || 'Anonymous User',
            expertName: expertNameMap[expertIdStr] || 'Unknown Expert'
          });
        }
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
