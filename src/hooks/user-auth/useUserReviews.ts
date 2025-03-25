
import { toast } from 'sonner';
import { UserProfile, Review } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

export const useUserReviews = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addReview = async (expertId: string, rating: number, comment: string) => {
    if (!currentUser) {
      toast.error('Please log in to add a review');
      return;
    }

    try {
      const newReview = {
        user_id: currentUser.id,
        expert_id: parseInt(expertId, 10), // Convert string to number
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_reviews')
        .insert(newReview);

      if (error) throw error;

      // Optimistically update the local state
      const adaptedReview: Review = {
        id: data && data[0] && data[0].id ? data[0].id : `temp_${Date.now()}`,
        expertId: expertId,
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
      };

      const updatedUser = {
        ...currentUser,
        reviews: [...(currentUser.reviews || []), adaptedReview],
      };
      setCurrentUser(updatedUser);

      toast.success('Review added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add review');
    }
  };

  return {
    addReview
  };
};
