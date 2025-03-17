
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Review } from '@/types/supabase/reviews';

export const useReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      // Using proper join syntax for Supabase
      const { data, error } = await supabase
        .from('user_reviews')
        .select(`
          id,
          user_id,
          expert_id,
          rating,
          comment,
          date,
          verified,
          experts:expert_id (name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform the data to match Review type
      const formattedReviews: Review[] = data.map(review => ({
        id: review.id,
        expertId: review.expert_id.toString(),
        expertName: review.experts?.name || 'Unknown Expert',
        userId: review.user_id,
        userName: 'User', // This would need to be fetched separately or included in the query
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        verified: review.verified
      }));

      setReviews(formattedReviews);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (filterRating !== null && review.rating !== filterRating) {
      return false;
    }
    if (filterVerified !== null && review.verified !== filterVerified) {
      return false;
    }
    return true;
  });

  // Edit review
  const editReview = (review: Review) => {
    setEditingReview(review);
  };

  const updateReview = async (updatedReview: Review) => {
    try {
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating: updatedReview.rating,
          comment: updatedReview.comment,
          verified: updatedReview.verified
        })
        .eq('id', updatedReview.id);

      if (error) throw error;

      setReviews(reviews.map(r => 
        r.id === updatedReview.id ? updatedReview : r
      ));
      toast.success('Review updated successfully');
      setEditingReview(null);
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  // Delete review
  const confirmDelete = (review: Review) => {
    setDeletingReview(review);
  };

  const deleteReview = async () => {
    if (!deletingReview) return;
    
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', deletingReview.id);

      if (error) throw error;

      setReviews(reviews.filter(r => r.id !== deletingReview.id));
      toast.success('Review deleted successfully');
      setDeletingReview(null);
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const cancelDelete = () => {
    setDeletingReview(null);
  };

  return {
    reviews: filteredReviews,
    loading,
    editingReview,
    deletingReview,
    filterRating,
    filterVerified,
    setFilterRating,
    setFilterVerified,
    editReview,
    updateReview,
    confirmDelete,
    deleteReview,
    cancelDelete
  };
};
