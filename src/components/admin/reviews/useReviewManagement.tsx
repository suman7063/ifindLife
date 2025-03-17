
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Review } from '@/types/supabase/reviews';

export const useReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [experts, setExperts] = useState<Array<{ id: string, name: string }>>([]);
  
  // Edit review state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState('');
  
  // Delete review state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  
  // Fetch experts for the dropdown
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data, error } = await supabase
          .from('experts')
          .select('id, name');
        
        if (error) throw error;
        setExperts(data || []);
      } catch (error) {
        console.error('Error fetching experts:', error);
        toast.error('Failed to load experts');
      }
    };
    
    fetchExperts();
  }, []);
  
  // Fetch reviews when expert selection changes
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('user_reviews')
          .select('*, experts:expert_id(name)');
        
        if (selectedExpertId) {
          // Convert string to number for database query
          query = query.eq('expert_id', parseInt(selectedExpertId));
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        const formattedReviews: Review[] = (data || []).map(review => ({
          id: review.id,
          expertId: review.expert_id.toString(),
          expertName: review.experts?.name || 'Unknown Expert',
          userId: review.user_id,
          userName: review.user_id ? `User ${review.user_id.slice(0, 8)}...` : 'Anonymous User',
          rating: review.rating,
          comment: review.comment || '',
          date: review.date,
          verified: review.verified,
        }));
        
        setReviews(formattedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [selectedExpertId]);
  
  // Open edit dialog
  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setEditedRating(review.rating);
    setEditedComment(review.comment || '');
    setIsEditDialogOpen(true);
  };
  
  // Update review
  const handleUpdateReview = async () => {
    if (!currentReview) return;
    
    try {
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating: editedRating,
          comment: editedComment,
        })
        .eq('id', currentReview.id);
      
      if (error) throw error;
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === currentReview.id 
          ? { ...review, rating: editedRating, comment: editedComment }
          : review
      ));
      
      toast.success('Review updated successfully');
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };
  
  // Open delete dialog
  const handleDeletePrompt = (review: Review) => {
    setReviewToDelete(review);
    setIsDeleteDialogOpen(true);
  };
  
  // Delete review
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', reviewToDelete.id);
      
      if (error) throw error;
      
      // Update local state
      setReviews(reviews.filter(review => review.id !== reviewToDelete.id));
      
      toast.success('Review deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };
  
  // Filter reviews by search query
  const filteredReviews = reviews.filter(review => 
    review.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.expertName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return {
    loading,
    experts,
    searchQuery,
    setSearchQuery,
    selectedExpertId,
    setSelectedExpertId,
    filteredReviews,
    handleEdit,
    handleDeletePrompt,
    isEditDialogOpen,
    setIsEditDialogOpen,
    currentReview,
    editedRating,
    setEditedRating,
    editedComment,
    setEditedComment,
    handleUpdateReview,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    reviewToDelete,
    handleDeleteReview,
  };
};
