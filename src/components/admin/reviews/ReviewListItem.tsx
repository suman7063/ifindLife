
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Star } from 'lucide-react';
import { Review } from '@/types/supabase/reviews';

interface ReviewListItemProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
}

const ReviewListItem: React.FC<ReviewListItemProps> = ({ 
  review, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{review.userName || 'Anonymous User'}</div>
          <div className="text-sm text-muted-foreground">
            Reviewed: {review.expertName} | {new Date(review.date).toLocaleDateString()}
          </div>
          <div className="flex items-center mt-1 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star 
                key={star} 
                className={`h-4 w-4 ${
                  star <= review.rating 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm">{review.rating}/5</span>
            {review.verified && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm">{review.comment || 'No comment provided'}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(review)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(review)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewListItem;
