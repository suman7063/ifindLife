
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

export interface Review {
  id: string;
  expertId: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  userId: string;
  userName: string;
  expertName: string;
}

export interface ReviewsResult {
  success: boolean;
  reviews: Review[];
}

/**
 * Fetch reviews for a user
 */
export const fetchUserReviews = async (userId: string): Promise<ReviewsResult> => {
  try {
    const { data, error } = await supabase
      .from('user_reviews')
      .select(`
        id,
        expert_id,
        rating,
        comment,
        date,
        verified,
        user_name
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { success: true, reviews: [] };
    }
    
    // Get expert names (for simplicity, we'll make a separate query)
    const expertIds = data.map(review => review.expert_id.toString());
    
    const { data: experts, error: expertError } = await supabase
      .from('experts')
      .select('id, name')
      .in('id', expertIds);
    
    if (expertError) {
      console.error('Error fetching expert names:', expertError);
    }
    
    // Create a map of expert IDs to names
    const expertNameMap: Record<string, string> = {};
    if (experts) {
      experts.forEach(expert => {
        expertNameMap[expert.id] = expert.name;
      });
    }
    
    // Map the data to Review objects
    const reviews: Review[] = data.map(item => ({
      id: item.id,
      expertId: item.expert_id.toString(),
      rating: item.rating,
      comment: item.comment || '',
      date: item.date,
      verified: Boolean(item.verified),
      userId: userId,
      userName: item.user_name || 'Anonymous User',
      expertName: expertNameMap[item.expert_id.toString()] || 'Unknown Expert'
    }));
    
    return { success: true, reviews };
    
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return { success: false, reviews: [] };
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
    // Check if user has already reviewed this expert
    const { data: existingReviews } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', userProfile.id)
      .eq('expert_id', expertId);
    
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
          expert_id: expertId,
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
    const { data: transactions } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', userProfile.id)
      .eq('expert_id', expertId);
    
    return !!(transactions && transactions.length > 0);
  } catch (error: any) {
    console.error('Error checking transactions:', error);
    return false;
  }
};
