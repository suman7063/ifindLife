
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { convertExpertIdToNumber, convertExpertIdToString } from '@/types/supabase/expertId';
import { Review } from '@/types/supabase/reviews';

// Define database review type to avoid excessive type inference
interface DbReview {
  id: string;
  expert_id: number;
  rating: number;
  comment: string | null;
  date: string;
  verified: boolean | null;
  user_id: string;
  user_name: string | null;
}

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
      
      return await fetchUserReviews(userProfile.id);
      
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast.error(error.message || 'Failed to add review');
      return {
        success: false,
        reviews: []
      };
    }
  };

  // Fetch reviews for a specific user
  const fetchUserReviews = async (userId: string): Promise<{success: boolean, reviews: Review[]}> => {
    try {
      // Simple JOIN query to get reviews with expert data in a single query
      const { data, error } = await supabase.rpc('get_user_reviews_with_experts', {
        user_id_param: userId
      });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return { success: true, reviews: [] };
      }
      
      // Map the joined data directly to Review objects
      const reviews: Review[] = data.map((item): Review => ({
        id: item.review_id,
        expertId: String(item.expert_id),
        rating: item.rating,
        comment: item.comment || '',
        date: item.date,
        verified: Boolean(item.verified),
        userId: userId,
        userName: item.user_name || 'Anonymous User',
        expertName: item.expert_name || 'Unknown Expert'
      }));
      
      return { success: true, reviews };
      
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      return { success: false, reviews: [] };
    }
  };
  
  // Alternative implementation if the RPC function is not available
  const fetchUserReviewsLegacy = async (userId: string): Promise<{success: boolean, reviews: Review[]}> => {
    try {
      // Fetch reviews
      const { data: dbReviews, error: reviewsError } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('user_id', userId);
      
      if (reviewsError) throw reviewsError;
      
      // Early return if no reviews
      if (!dbReviews || dbReviews.length === 0) {
        return {
          success: true,
          reviews: []
        };
      }
      
      // Extract expert IDs
      const expertIdNumbers: number[] = [];
      for (const review of dbReviews) {
        if (!expertIdNumbers.includes(review.expert_id)) {
          expertIdNumbers.push(review.expert_id);
        }
      }
      
      // Convert to string IDs for query
      const expertIdStrings: string[] = expertIdNumbers.map(convertExpertIdToString);
      
      // Get expert data
      const { data: experts } = await supabase
        .from('experts')
        .select('id, name')
        .in('id', expertIdStrings);
      
      // Create expert name lookup
      const expertNameMap: Record<string, string> = {};
      
      if (experts) {
        for (const expert of experts) {
          expertNameMap[expert.id] = expert.name;
        }
      }
      
      // Create review objects with explicit typing
      const reviews: Review[] = dbReviews.map((dbReview: DbReview) => {
        const expertIdStr = convertExpertIdToString(dbReview.expert_id);
        
        return {
          id: dbReview.id,
          expertId: expertIdStr,
          rating: dbReview.rating,
          comment: dbReview.comment || '',
          date: dbReview.date,
          verified: Boolean(dbReview.verified),
          userId: userId,
          userName: dbReview.user_name || 'Anonymous User',
          expertName: expertNameMap[expertIdStr] || 'Unknown Expert'
        };
      });
      
      return {
        success: true,
        reviews
      };
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
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
    hasTakenServiceFrom,
    fetchUserReviews
  };
};
