
import { useFetchReviews } from './hooks/useFetchReviews';
import { useReviewFilters } from './hooks/useReviewFilters';
import { useReviewActions } from './hooks/useReviewActions';

export const useReviewManagement = () => {
  const { reviews, loading, experts, fetchReviews } = useFetchReviews();
  
  const {
    filterRating,
    filterVerified,
    searchQuery,
    selectedExpertId,
    setFilterRating,
    setFilterVerified,
    setSearchQuery,
    setSelectedExpertId,
    filteredReviews
  } = useReviewFilters(reviews);
  
  const {
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
    handleEdit,
    handleDeletePrompt,
    handleUpdateReview,
    handleDeleteReview
  } = useReviewActions(fetchReviews);
  
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
