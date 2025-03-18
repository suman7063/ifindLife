
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Function to fetch user reviews
export const fetchUserReviews = async (userId: string) => {
  try {
    // Use direct query instead of the problematic type instantiation
    const { data, error } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }

    // Transform the data manually to avoid type issues
    return (data || []).map(item => ({
      id: item.id,
      expertId: item.expert_id,
      rating: item.rating,
      comment: item.comment,
      date: item.date,
      verified: item.verified,
      userName: item.user_name || '',
      expertName: '', // This might be filled in on the client side or through a join
    }));
  } catch (error) {
    console.error('Error in fetchUserReviews:', error);
    return [];
  }
};

// Function to fetch reviews by expert ID
export const fetchExpertReviews = async (expertId: number) => {
  try {
    const { data, error } = await supabase
      .from('user_reviews')
      .select('*')
      .eq('expert_id', expertId);

    if (error) {
      console.error('Error fetching expert reviews:', error);
      return [];
    }

    // Transform the data manually to avoid type issues
    return (data || []).map(item => ({
      id: item.id,
      expertId: item.expert_id,
      rating: item.rating,
      comment: item.comment,
      date: item.date,
      verified: item.verified,
      userName: item.user_name || '',
      expertName: '', // This might be filled in on the client side or through a join
    }));
  } catch (error) {
    console.error('Error in fetchExpertReviews:', error);
    return [];
  }
};

// Submit a new review
export const submitReview = async (
  userId: string,
  userName: string,
  expertId: number,
  rating: number,
  comment: string
) => {
  try {
    const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('user_reviews')
      .insert({
        user_id: userId,
        user_name: userName,
        expert_id: expertId,
        rating,
        comment,
        date,
        verified: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
      return null;
    }

    toast.success('Review submitted successfully');
    
    // Transform the data manually to avoid type issues
    return {
      id: data.id,
      expertId: data.expert_id,
      rating: data.rating,
      comment: data.comment,
      date: data.date,
      verified: data.verified,
      userName: data.user_name || '',
      expertName: '', // This might be filled in on the client side
    };
  } catch (error) {
    console.error('Error in submitReview:', error);
    toast.error('Failed to submit review');
    return null;
  }
};

// Update an existing review
export const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string
) => {
  try {
    const { error } = await supabase
      .from('user_reviews')
      .update({
        rating,
        comment,
        date: new Date().toISOString().split('T')[0], // Update the date to today
      })
      .eq('id', reviewId);

    if (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
      return false;
    }

    toast.success('Review updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateReview:', error);
    toast.error('Failed to update review');
    return false;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string) => {
  try {
    const { error } = await supabase
      .from('user_reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
      return false;
    }

    toast.success('Review deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteReview:', error);
    toast.error('Failed to delete review');
    return false;
  }
};

// Check if user has taken service from expert
export const hasTakenServiceFrom = async (expertId: string) => {
  // This is just a stub - implement with real logic
  return true;
};

// Add a review - function for useReviews hook
export const addReview = async (expertId: number, rating: number, comment: string) => {
  // This is just a stub - implement with real logic
  return true;
};
