
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useUserAuth } from '@/hooks/user-auth';
import StarRating from '@/components/StarRating';

interface ExpertReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string;
  expertName: string;
}

const ExpertReviewModal: React.FC<ExpertReviewModalProps> = ({
  isOpen,
  onClose,
  expertId,
  expertName
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, addReview } = useUserAuth();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!currentUser) {
      toast.error('You must be logged in to leave a review');
      return;
    }

    setIsSubmitting(true);

    try {
      const review = {
        expert_id: expertId,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
        user_name: currentUser.name
      };

      const success = await addReview(review);

      if (success) {
        toast.success('Review submitted successfully');
        onClose();
      } else {
        toast.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An error occurred while submitting your review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate your experience with {expertName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center space-y-4">
            <StarRating 
              rating={rating} 
              onRatingChange={setRating} 
              size={32} 
              editable 
            />
            <Textarea
              placeholder="Share your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReviewModal;
