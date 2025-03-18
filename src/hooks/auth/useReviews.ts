
import { useState, useEffect } from 'react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { 
  fetchUserReviews, 
  fetchExpertReviews, 
  submitReview, 
  updateReview, 
  deleteReview,
  hasTakenServiceFrom,
  addReview 
} from './utils/reviewUtils';
import { ReviewStatus } from '@/types/supabase/reviews';

const useReviews = () => {
  const { currentUser } = useUserAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user reviews on component mount
  useEffect(() => {
    const loadUserReviews = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const reviews = await fetchUserReviews(currentUser.id);
        setUserReviews(reviews);
        setError(null);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    loadUserReviews();
  }, [currentUser]);

  // Get reviews for a specific expert
  const getExpertReviews = async (expertId: number) => {
    try {
      setLoading(true);
      const reviews = await fetchExpertReviews(expertId);
      return reviews;
    } catch (err) {
      console.error('Error fetching expert reviews:', err);
      setError('Failed to fetch expert reviews');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Submit a new review
  const submitUserReview = async (expertId: number, rating: number, comment: string) => {
    if (!currentUser) {
      setError('You must be logged in to submit a review');
      return null;
    }

    try {
      setLoading(true);
      const review = await submitReview(
        currentUser.id,
        currentUser.name || 'Anonymous',
        expertId,
        rating,
        comment
      );
      
      if (review) {
        setUserReviews(prev => [...prev, review]);
      }
      
      return review;
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing review
  const updateUserReview = async (reviewId: string, rating: number, comment: string) => {
    if (!currentUser) {
      setError('You must be logged in to update a review');
      return false;
    }

    try {
      setLoading(true);
      const success = await updateReview(reviewId, rating, comment);
      
      if (success) {
        // Update the review in the local state
        setUserReviews(prev => 
          prev.map(review => 
            review.id === reviewId 
              ? { ...review, rating, comment, date: new Date().toISOString().split('T')[0] } 
              : review
          )
        );
      }
      
      return success;
    } catch (err) {
      console.error('Error updating review:', err);
      setError('Failed to update review');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a review
  const deleteUserReview = async (reviewId: string) => {
    if (!currentUser) {
      setError('You must be logged in to delete a review');
      return false;
    }

    try {
      setLoading(true);
      const success = await deleteReview(reviewId);
      
      if (success) {
        // Remove the review from the local state
        setUserReviews(prev => prev.filter(review => review.id !== reviewId));
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if the user has already reviewed an expert
  const hasReviewedExpert = (expertId: number) => {
    return userReviews.some(review => review.expertId === expertId);
  };

  // Check if user can review an expert
  const checkReviewStatus = async (expertId: string): Promise<ReviewStatus> => {
    if (!currentUser) {
      return { canReview: false, hasReviewed: false };
    }

    const canReview = await hasTakenServiceFrom(expertId);
    const hasReviewed = userReviews.some(review => review.expertId.toString() === expertId);

    return { canReview, hasReviewed };
  };

  return {
    userReviews,
    loading,
    error,
    getExpertReviews,
    submitUserReview,
    updateUserReview,
    deleteUserReview,
    hasReviewedExpert,
    checkReviewStatus,
    addReview: submitUserReview,
    hasTakenServiceFrom
  };
};

export default useReviews;
