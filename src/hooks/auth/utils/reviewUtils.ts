
import { from } from '@/lib/supabase';
import { UserReview } from '@/types/supabase/tables';

// Fetch user's reviews for a specific expert
export const getReviewForExpert = async (userId: string, expertId: string): Promise<UserReview | null> => {
  try {
    const { data, error } = await from('user_reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('expert_id', expertId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      throw error;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      expertId: data.expert_id,
      userId: data.user_id,
      rating: data.rating,
      comment: data.comment,
      date: data.date,
      verified: data.verified
    };
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
};

// Add or update a review
export const updateReviews = async (
  userId: string,
  expertId: string,
  rating: number,
  comment: string,
  existingReviewId?: string
): Promise<UserReview[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    if (existingReviewId) {
      // Update existing review
      const { error } = await from('user_reviews')
        .update({
          rating,
          comment,
          date: today
        })
        .eq('id', existingReviewId);
        
      if (error) throw error;
    } else {
      // Add new review
      const { error } = await from('user_reviews')
        .insert({
          user_id: userId,
          expert_id: expertId,
          rating,
          comment,
          date: today,
          verified: false
        });
        
      if (error) throw error;
    }
    
    // Return updated reviews list
    const { data, error: fetchError } = await from('user_reviews')
      .select('*')
      .eq('user_id', userId);
      
    if (fetchError) throw fetchError;
    
    const reviews = (data || []).map((review: any) => ({
      id: review.id,
      expertId: review.expert_id,
      userId: review.user_id,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      verified: review.verified
    }));
    
    return reviews;
  } catch (error) {
    console.error('Error updating reviews:', error);
    throw error;
  }
};

// Check if user has taken a service from the expert
export const hasServiceFromExpert = async (userId: string, expertId: string): Promise<boolean> => {
  try {
    // Check completed appointments with this expert
    const { data: appointmentData, error: appointmentError } = await from('appointments')
      .select('*')
      .eq('user_id', userId)
      .eq('expert_id', expertId)
      .eq('status', 'completed');
      
    if (appointmentError) throw appointmentError;
    
    if (appointmentData && appointmentData.length > 0) {
      return true;
    }
    
    // Check completed services with this expert
    const { data: serviceData, error: serviceError } = await from('user_expert_services')
      .select('*')
      .eq('user_id', userId)
      .eq('expert_id', expertId)
      .eq('status', 'completed');
      
    if (serviceError) throw serviceError;
    
    return !!(serviceData && serviceData.length > 0);
  } catch (error) {
    console.error('Error checking service history:', error);
    return false; // Default to false on error
  }
};
