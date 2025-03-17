
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Expert } from '@/types/supabase';
import { Review } from '@/types/supabase/reviews';
import { convertExpertIdToString } from '@/types/supabase/expertId';

export const useReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [filterRating, setFilterRating] = useState(0);
  const [filterVerified, setFilterVerified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertId, setSelectedExpertId] = useState('');
  
  // Edit states
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState('');
  
  // Delete states
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch reviews with join to experts
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_reviews')
        .select(`
          id,
          user_id,
          expert_id,
          rating,
          comment,
          date,
          verified
        `);

      if (error) {
        throw error;
      }

      if (data) {
        // Fetch expert names separately
        // Convert numeric expert IDs to strings for the IN clause
        const expertIds = [...new Set(data.map(review => review.expert_id))];
        const expertIdsAsStrings = expertIds.map(id => id.toString());
        
        const { data: expertsData, error: expertsError } = await supabase
          .from('experts')
          .select('id, name')
          .in('id', expertIdsAsStrings);
          
        if (expertsError) {
          console.error('Error fetching expert names:', expertsError);
        }
        
        // Create a map of expert ID to name
        const expertNameMap = new Map();
        if (expertsData) {
          expertsData.forEach(expert => {
            expertNameMap.set(String(expert.id), expert.name);
          });
        }
          
        const formattedReviews: Review[] = data.map((review) => ({
          id: review.id,
          expertId: convertExpertIdToString(review.expert_id),
          userId: review.user_id,
          expertName: expertNameMap.get(String(review.expert_id)) || 'Unknown Expert',
          rating: review.rating,
          comment: review.comment || '',
          date: review.date,
          verified: review.verified || false
        }));
        
        setReviews(formattedReviews);
      }
    } catch (error: any) {
      toast.error(`Error fetching reviews: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch experts for dropdown
  const fetchExperts = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('experts').select('*');
      if (error) throw error;
      setExperts(data || []);
    } catch (error: any) {
      toast.error(`Error fetching experts: ${error.message}`);
    }
  }, []);
  
  // Load data on mount
  useEffect(() => {
    fetchReviews();
    fetchExperts();
  }, [fetchReviews, fetchExperts]);
  
  // Filter reviews based on criteria
  const filteredReviews = reviews.filter((review) => {
    // Apply rating filter
    if (filterRating > 0 && review.rating !== filterRating) return false;
    
    // Apply verification filter
    if (filterVerified && !review.verified) return false;
    
    // Apply expert filter
    if (selectedExpertId && review.expertId !== selectedExpertId) return false;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (review.comment && review.comment.toLowerCase().includes(query)) ||
        (review.expertName && review.expertName.toLowerCase().includes(query)) ||
        (review.userName && review.userName.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Handle review edit
  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
    setIsEditDialogOpen(true);
  };
  
  // Handle delete prompt
  const handleDeletePrompt = (review: Review) => {
    setDeletingReview(review);
    setIsDeleteDialogOpen(true);
  };
  
  // Update a review
  const handleUpdateReview = async () => {
    if (!editingReview) return;
    
    try {
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating: editedRating,
          comment: editedComment,
        })
        .eq('id', editingReview.id);
      
      if (error) throw error;
      
      // Update reviews in state
      setReviews(reviews.map(review => 
        review.id === editingReview.id 
          ? { ...review, rating: editedRating, comment: editedComment }
          : review
      ));
      
      toast.success('Review updated successfully');
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error updating review: ${error.message}`);
    }
  };
  
  // Delete a review
  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', deletingReview.id);
      
      if (error) throw error;
      
      // Remove review from state
      setReviews(reviews.filter(review => review.id !== deletingReview.id));
      
      toast.success('Review deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(`Error deleting review: ${error.message}`);
    }
  };
  
  // Cancel edit
  const cancelEdit = () => {
    setIsEditDialogOpen(false);
  };
  
  // Cancel delete
  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
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
    editedRating,
    setEditedRating,
    editedComment,
    setEditedComment,
    handleUpdateReview,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDeleteReview,
    cancelEdit,
    cancelDelete
  };
};
