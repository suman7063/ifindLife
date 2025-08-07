
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';
import { Review, NewReview } from '@/types/supabase/tables';
import { supabase } from '@/lib/supabase';

export const useUserReviews = (
  currentUser: UserProfile | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
  const addReview = async (reviewData: NewReview): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Please log in to add a review');
      return false;
    }

    try {
      const expertId = reviewData.expert_id || reviewData.expertId;
      const newReview = {
        user_id: currentUser.id,
        expert_id: String(expertId), // Convert to string for UUID
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_reviews')
        .insert(newReview);

      if (error) throw error;

      // Create a safer way to get the ID
      let newId = `temp_${Date.now()}`;
      
      if (data) {
        // Ensure data is an array
        const dataArray = Array.isArray(data) ? data : [];
        // Check if array has items and first item has an id
        if (dataArray.length > 0 && typeof dataArray[0] === 'object') {
          const firstItem = dataArray[0] as Record<string, any>;
          if ('id' in firstItem) {
            newId = firstItem.id;
          }
        }
      }

      // Optimistically update the local state
      const adaptedReview: Review = {
        id: newId,
        expert_id: expertId, // Using expert_id property to match our unified type
        user_id: currentUser.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: new Date().toISOString(),
      };

      const updatedUser = {
        ...currentUser,
        reviews: [...(currentUser.reviews || []), adaptedReview],
      };
      setCurrentUser(updatedUser);

      toast.success('Review added successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add review');
      return false;
    }
  };

  return {
    addReview
  };
};
