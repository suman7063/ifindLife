import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ReviewUI } from '@/types/supabase/reviews';

// Helper function to convert numeric IDs to strings
const convertToStringId = (id: number | string): string => {
  return String(id);
};

// Hook for managing reviews in the admin panel
export const useReviewManagement = () => {
  const [reviews, setReviews] = useState<ReviewUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [deletingReview, setDeletingReview] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState(0);
  const [filterVerified, setFilterVerified] = useState(false);
  const [searchExpert, setSearchExpert] = useState('');
  const [searchUser, setSearchUser] = useState('');
  
  // Fetch reviews data
  const fetchReviews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('user_reviews')
        .select(`
          id,
          rating,
          comment,
          verified,
          created_at,
          updated_at,
          user_id (id, name, email, profile_picture),
          expert_id (id, name, email, profile_picture, specialty)
        `);
      
      if (filterRating > 0) {
        query = query.eq('rating', filterRating);
      }
      
      if (filterVerified) {
        query = query.eq('verified', true);
      }
      
      // If searching by expert
      if (searchExpert.trim()) {
        // First find experts matching the search term
        const { data: experts } = await supabase
          .from('experts')
          .select('id')
          .ilike('name', `%${searchExpert}%`);
        
        if (experts && experts.length > 0) {
          // Convert numeric IDs to strings before using in query
          const expertIds = experts.map(expert => convertToStringId(expert.id));
          query = query.in('expert_id', expertIds as string[]);
        } else {
          // No matching experts found
          setReviews([]);
          setLoading(false);
          return;
        }
      }
      
      // If searching by user
      if (searchUser.trim()) {
        // First find users matching the search term
        const { data: users } = await supabase
          .from('users')
          .select('id')
          .ilike('name', `%${searchUser}%`);
        
        if (users && users.length > 0) {
          const userIds = users.map(user => user.id);
          query = query.in('user_id', userIds);
        } else {
          // No matching users found
          setReviews([]);
          setLoading(false);
          return;
        }
      }
      
      // Execute the query with all filters applied
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
        return;
      }
      
      // Transform the data for UI
      const reviewsData = (data || []).map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        verified: review.verified,
        createdAt: review.created_at,
        updatedAt: review.updated_at,
        user: review.user_id,
        expert: review.expert_id
      }));
      
      setReviews(reviewsData);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast.error(error.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };
  
  // Start editing a review
  const startEdit = (id: string) => {
    setEditingReview(id);
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingReview(null);
  };
  
  // Save the edited review
  const saveEdit = async (id: string, verified: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_reviews')
        .update({ verified })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating review:', error);
        toast.error('Failed to update review');
        return;
      }
      
      toast.success('Review updated successfully');
      setEditingReview(null);
      fetchReviews(); // Refresh reviews
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast.error(error.message || 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };
  
  // Start deleting a review
  const startDelete = (id: string) => {
    setDeletingReview(id);
  };
  
  // Cancel deleting
  const cancelDelete = () => {
    setDeletingReview(null);
  };
  
  // Confirm deletion of a review
  const confirmDelete = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
        return;
      }
      
      toast.success('Review deleted successfully');
      setDeletingReview(null);
      fetchReviews(); // Refresh reviews
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    reviews,
    loading,
    editingReview,
    deletingReview,
    filterRating,
    filterVerified,
    setFilterRating,
    setFilterVerified,
    searchExpert,
    setSearchExpert,
    searchUser,
    setSearchUser,
    fetchReviews,
    startEdit,
    cancelEdit,
    saveEdit,
    startDelete,
    confirmDelete,
    cancelDelete
  };
};
