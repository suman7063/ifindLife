
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { ExpertIdDB, convertExpertIdToNumber, convertExpertIdToString } from '@/types/supabase/expertId';
import { Review } from '@/types/supabase/reviews';

export const useReviews = () => {
  const hasTakenServiceFrom = async (currentUser: UserProfile | null, expertId: string): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      // Convert string ID to number for database
      const expertIdNumber: ExpertIdDB = convertExpertIdToNumber(expertId);
      
      // Check if there are any completed service engagements between the user and expert
      const { data, error } = await supabase
        .from('user_expert_services')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertIdNumber.toString()) // Convert to string for Supabase query
        .eq('status', 'completed')
        .limit(1);

      if (error) {
        console.error('Error checking service history:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking service history:', error);
      return false;
    }
  };

  const hasReviewedExpert = async (currentUser: UserProfile | null, expertId: string): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      // Convert string ID to number for database
      const expertIdNumber: ExpertIdDB = convertExpertIdToNumber(expertId);
      
      const { data, error } = await supabase
        .from('user_reviews')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('expert_id', expertIdNumber)
        .limit(1);

      if (error) {
        console.error('Error checking review history:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking review history:', error);
      return false;
    }
  };

  const addReview = async (currentUser: UserProfile | null, expertId: string, rating: number, comment: string) => {
    if (!currentUser) {
      toast.error('Please log in to add a review');
      return null;
    }

    try {
      // Check if user has taken service from this expert
      const hasTakenService = await hasTakenServiceFrom(currentUser, expertId);
      const hasReviewed = await hasReviewedExpert(currentUser, expertId);

      if (hasReviewed) {
        toast.error('You have already reviewed this expert');
        return null;
      }

      if (!hasTakenService) {
        toast.error('You can only review experts after taking their service');
        return null;
      }
      
      // Convert string ID to number for database
      const expertIdNumber: ExpertIdDB = convertExpertIdToNumber(expertId);

      const { data, error } = await supabase
        .from('user_reviews')
        .insert({
          user_id: currentUser.id,
          expert_id: expertIdNumber,
          rating: rating,
          comment: comment,
          date: new Date().toISOString(),
          verified: true
        })
        .select();

      if (error) throw error;

      // Return updated user data to update the local state
      const newReviewId = data && data.length > 0 ? data[0].id : 'temp_id';
      
      const newReview: Review = {
        id: newReviewId,
        expertId: expertId, // Store as string in our UI
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
        verified: true
      };

      const updatedUser = {
        ...currentUser,
        reviews: [...(currentUser.reviews || []), newReview],
      };

      toast.success('Review added successfully!');
      return updatedUser;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add review');
      return null;
    }
  };

  return {
    hasTakenServiceFrom,
    hasReviewedExpert,
    addReview
  };
};
