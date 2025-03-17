
import React from 'react';
import { Review } from '@/types/supabase/reviews';
import ReviewListItem from './ReviewListItem';

interface ReviewListProps {
  reviews: Review[];
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
  loading: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  onEdit,
  onDelete,
  loading
}) => {
  if (loading) {
    return <div className="text-center py-10">Loading reviews...</div>;
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No reviews found
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-6">
      {reviews.map(review => (
        <ReviewListItem 
          key={review.id}
          review={review}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReviewList;
