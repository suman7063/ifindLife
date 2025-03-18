
import { UserProfile } from '@/types/supabase';
import { 
  addReview as addUserReview,
  fetchUserReviews as fetchReviews,
  hasTakenServiceFrom as checkServiceTaken
} from './utils/reviewUtils';

/**
 * Hook for managing user reviews
 */
export const useReviews = () => {
  return {
    addReview: addUserReview,
    fetchUserReviews: fetchReviews,
    hasTakenServiceFrom: checkServiceTaken
  };
};
