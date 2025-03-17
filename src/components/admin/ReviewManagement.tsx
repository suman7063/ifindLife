
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useReviewManagement } from './reviews/useReviewManagement';
import ReviewFilters from './reviews/ReviewFilters';
import ReviewList from './reviews/ReviewList';
import EditReviewDialog from './reviews/EditReviewDialog';
import DeleteReviewDialog from './reviews/DeleteReviewDialog';

const ReviewManagement: React.FC = () => {
  const {
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
  } = useReviewManagement();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Management</CardTitle>
        <CardDescription>
          Manage user reviews for experts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ReviewFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedExpertId={selectedExpertId}
            setSelectedExpertId={setSelectedExpertId}
            experts={experts}
          />
          
          <ReviewList
            reviews={filteredReviews}
            onEdit={handleEdit}
            onDelete={handleDeletePrompt}
            loading={loading}
          />
        </div>
        
        {/* Edit Review Dialog */}
        <EditReviewDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          review={currentReview}
          editedRating={editedRating}
          editedComment={editedComment}
          setEditedRating={setEditedRating}
          setEditedComment={setEditedComment}
          onSave={handleUpdateReview}
        />
        
        {/* Delete Review Dialog */}
        <DeleteReviewDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onDelete={handleDeleteReview}
        />
      </CardContent>
    </Card>
  );
};

export default ReviewManagement;
