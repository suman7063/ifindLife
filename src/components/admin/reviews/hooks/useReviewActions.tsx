
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Review } from '@/types/supabase/reviews';
import { convertExpertIdToNumber } from '@/types/supabase/expertId';

export const useReviewActions = (fetchReviews: () => Promise<void>) => {
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditedRating(review.rating);
    setEditedComment(review.comment);
    setIsEditDialogOpen(true);
  };
  
  const handleDeletePrompt = (review: Review) => {
    setDeletingReview(review.id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleUpdateReview = async () => {
    if (!editingReview) return;
    
    setLoading(true);
    try {
      const expertIdNumber = convertExpertIdToNumber(editingReview.expertId);
      
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating: editedRating,
          comment: editedComment,
          verified: true
        })
        .eq('id', editingReview.id);
      
      if (error) {
        toast.error('Failed to update review');
        return;
      }
      
      toast.success('Review updated successfully');
      setIsEditDialogOpen(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteReview = async () => {
    if (!deletingReview) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', deletingReview);
      
      if (error) {
        toast.error('Failed to delete review');
        return;
      }
      
      toast.success('Review deleted successfully');
      setIsDeleteDialogOpen(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    editingReview,
    deletingReview,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editedRating,
    setEditedRating,
    editedComment,
    setEditedComment,
    loading,
    handleEdit,
    handleDeletePrompt,
    handleUpdateReview,
    handleDeleteReview
  };
};
