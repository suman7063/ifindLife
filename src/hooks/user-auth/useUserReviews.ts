
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
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
      const { data, error } = await supabase
        .from('user_reviews')
        .insert([{
          user_id: currentUser.id,
          expert_id: expertId,
          rating: rating,
          comment: comment,
          date: new Date().toISOString(),
        }]);

      if (error) throw error;

      // Optimistically update the local state
      const newReview = {
        id: data ? data[0].id : 'temp_id', // Use a temporary ID
        user_id: currentUser.id,
        expert_id: expertId,
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
      };

      const updatedUser = {
        ...currentUser,
        reviews: [...currentUser.reviews, newReview],
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
