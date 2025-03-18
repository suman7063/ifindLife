
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Review } from '@/types/supabase/reviews';
import { convertExpertIdToString, convertExpertIdToNumber } from '@/types/supabase/expertId';

// Add a new review
export const updateReviews = async (
  userId: string,
  expertId: string,
  rating: number,
  comment: string,
  existingReviewId?: string
): Promise<Review[]> => {
  const today = new Date().toISOString().split('T')[0];
  const expertIdNumber = convertExpertIdToNumber(expertId);
  
  try {
    if (existingReviewId) {
      // Update existing review
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating,
          comment,
          date: today
        })
        .eq('id', existingReviewId);
      
      if (error) throw error;
    } else {
      // Add new review
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          user_id: userId,
          expert_id: expertIdNumber,
          rating,
          comment,
          date: today,
          verified: false,
          user_name: 'User' // Should be updated later with actual user name
        });
      
      if (error) throw error;
    }
    
    // Get updated reviews
    const { data, error } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Convert to Review type
    const reviews: Review[] = (data || []).map(review => ({
      id: review.id,
      userId: review.user_id || '',
      expertId: convertExpertIdToString(review.expert_id),
      rating: review.rating,
      comment: review.comment || '',
      date: review.date,
      verified: review.verified || false,
      userName: 'User', // Will be updated
      expertName: 'Expert' // Will be updated
    }));
    
    return reviews;
  } catch (error: any) {
    console.error('Error updating reviews:', error.message);
    toast.error(error.message || 'Failed to update review');
    return [];
  }
};

// Check if a user has already reviewed this expert
export const getReviewForExpert = async (userId: string, expertId: string) => {
  const expertIdNumber = convertExpertIdToNumber(expertId);
  
  try {
    const { data, error } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('expert_id', expertIdNumber)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" which is not an error for us
    
    return data;
  } catch (error: any) {
    console.error('Error checking review:', error.message);
    return null;
  }
};

// Check if the user has taken a service from this expert
export const hasServiceFromExpert = async (userId: string, expertId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_expert_services')
      .select('*')
      .eq('user_id', userId)
      .eq('expert_id', expertId)
      .eq('status', 'completed')
      .limit(1);
    
    if (error) throw error;
    
    return data && data.length > 0;
  } catch (error: any) {
    console.error('Error checking service history:', error.message);
    return false;
  }
};
