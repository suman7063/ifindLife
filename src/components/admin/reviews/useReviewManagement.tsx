
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Review } from '@/types/supabase/reviews';
import { convertExpertIdToString } from '@/types/supabase/expertId';

export const useReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState(0);
  const [filterVerified, setFilterVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [experts, setExperts] = useState<Array<{id: string, name: string}>>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState('');
  
  // Fetch all available experts for the filter dropdown
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data, error } = await supabase
          .from('experts')
          .select('id, name');
        
        if (error) {
          console.error('Error fetching experts:', error);
          return;
        }
        
        setExperts(data || []);
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
    };
    
    fetchExperts();
  }, []);
  
  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);
  
  // Computed property for filtered reviews
  const filteredReviews = reviews.filter(review => {
    // Filter by rating if selected
    if (filterRating > 0 && review.rating !== filterRating) {
      return false;
    }
    
    // Filter by verification status if selected
    if (filterVerified && !review.verified) {
      return false;
    }
    
    // Filter by selected expert if any
    if (selectedExpertId && review.expertId !== selectedExpertId) {
      return false;
    }
    
    // Filter by search query (check both user name and comment)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesUserName = review.userName.toLowerCase().includes(query);
      const matchesComment = (review.comment || '').toLowerCase().includes(query);
      return matchesUserName || matchesComment;
    }
    
    return true;
  });
  
  // Fetch reviews data
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reviews')
        .select(`
          id,
          rating,
          comment,
          verified,
          date,
          user_id,
          expert_id
        `);
      
      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
        setLoading(false);
        return;
      }
      
      // Get user names and expert names
      const reviewsData = await Promise.all((data || []).map(async (review) => {
        // Get user name
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', review.user_id)
          .single();
        
        // Get expert name
        const { data: expertData } = await supabase
          .from('experts')
          .select('name')
          .eq('id', review.expert_id)
          .single();
        
        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment || '',
          date: review.date || new Date().toISOString(),
          verified: review.verified || false,
          userId: review.user_id || '',
          expertId: convertExpertIdToString(review.expert_id), // Convert number to string
          userName: userData?.name || 'Anonymous User',
          expertName: expertData?.name || 'Unknown Expert'
        };
      }));
      
      setReviews(reviewsData);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast.error(error.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit review
  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
    setIsEditDialogOpen(true);
  };
  
  // Handle delete prompt
  const handleDeletePrompt = (review: Review) => {
    setDeletingReview(review.id);
    setIsDeleteDialogOpen(true);
  };
  
  // Update review
  const handleUpdateReview = async () => {
    if (!editingReview) return;
    
    setLoading(true);
    try {
      // Need to convert string expertId back to number for database
      const expertIdNumber = parseInt(editingReview.expertId);
      
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating: editedRating,
          comment: editedComment,
          verified: true // Mark as verified when edited by admin
        })
        .eq('id', editingReview.id);
      
      if (error) {
        console.error('Error updating review:', error);
        toast.error('Failed to update review');
        return;
      }
      
      toast.success('Review updated successfully');
      setIsEditDialogOpen(false);
      fetchReviews(); // Refresh reviews
    } catch (error: any) {
      console.error('Error updating review:', error);
      toast.error(error.message || 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete review
  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', deletingReview);
      
      if (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
        return;
      }
      
      toast.success('Review deleted successfully');
      setIsDeleteDialogOpen(false);
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
    searchQuery,
    setSearchQuery,
    selectedExpertId,
    setSelectedExpertId,
    filteredReviews,
    experts,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editedRating,
    setEditedRating,
    editedComment,
    setEditedComment,
    setFilterRating,
    setFilterVerified,
    fetchReviews,
    handleEdit,
    handleDeletePrompt,
    handleUpdateReview,
    handleDeleteReview
  };
};
