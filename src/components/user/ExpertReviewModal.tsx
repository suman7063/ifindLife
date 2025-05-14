
import React, { useState } from 'react';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ExpertReviewModalProps {
  expertId: string;
  expertName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewSubmit?: () => void;
}

const ExpertReviewModal: React.FC<ExpertReviewModalProps> = ({
  expertId,
  expertName,
  open,
  onOpenChange,
  onReviewSubmit
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (rating < 1) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setRating(5);
      setComment('');
      
      // Close modal
      onOpenChange(false);
      
      // Notify parent component
      if (onReviewSubmit) {
        onReviewSubmit();
      }
      
      toast.success('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review {expertName}</DialogTitle>
          <DialogDescription>
            Share your experience to help others find the right expert.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <StarRating 
              rating={rating} 
              onRatingChange={handleRatingChange} 
              size={24} 
              editable={true}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review (Optional)</label>
            <Textarea
              placeholder="Share your experience with this expert..."
              value={comment}
              onChange={handleCommentChange}
              className="min-h-[120px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReviewModal;
