
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Review } from '@/types/supabase/reviews';
import { UserProfile } from '@/types/supabase';
import { convertExpertIdToNumber, convertExpertIdToString } from '@/types/supabase/expertId';
import { DbReview, UserReviewWithExpert, ReviewsResult } from '../types/reviewTypes';

/**
 * Fetch reviews for a user using the RPC function
 */
export const fetchUserReviews = async (userId: string): Promise<ReviewsResult> => {
  try {
    // Call the RPC function with proper type parameters
    const { data, error } = await supabase
      .rpc<UserReviewWithExpert>('get_user_reviews_with_experts', {
        user_id_param: userId
      });
    
    if (error) throw error;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { success: true, reviews: [] };
    }
    
    // Map the data to Review objects with proper type handling
    const typedData = data as UserReviewWithExpert[];
    const reviews: Review[] = typedData.map((item): Review => ({
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
    // If the RPC function fails, try the legacy method
    return fetchUserReviewsLegacy(userId);
  }
};

/**
 * Alternative implementation if the RPC function is not available
 */
export const fetchUserReviewsLegacy = async (userId: string): Promise<ReviewsResult> => {
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
    const typedReviews = dbReviews as DbReview[];
    
    for (const review of typedReviews) {
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
    
    // Create review objects
    const reviews: Review[] = typedReviews.map((dbReview: DbReview) => {
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
    console.error('Error fetching reviews legacy method:', error);
    return {
      success: false,
      reviews: []
    };
  }
};

/**
 * Add a review to an expert
 */
export const addReview = async (
  userProfile: UserProfile,
  expertId: string,
  rating: number,
  comment: string
): Promise<ReviewsResult> => {
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

/**
 * Check if user has taken service from an expert
 */
export const hasTakenServiceFrom = async (
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
