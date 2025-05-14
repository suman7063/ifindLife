
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import { toast } from '@/hooks/use-toast';
import { normalizeExpertId } from '@/utils/userProfileAdapter';

interface ExpertReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string | number;
  expertName: string;
}

const ExpertReviewModal: React.FC<ExpertReviewModalProps> = ({
  isOpen,
  onClose,
  expertId,
  expertName
}) => {
  const { addReview } = useUserAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating before submitting',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const normalizedExpertId = normalizeExpertId(expertId);
      const success = await addReview({
        expertId: normalizedExpertId,
        rating,
        comment
      });
      
      if (success) {
        toast({
          title: 'Review submitted',
          description: 'Thank you for your feedback.'
        });
        onClose();
      } else {
        toast({
          title: 'Failed to submit review',
          description: 'Please try again later',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setRating(0);
    setComment('');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review {expertName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= (hoveredStar || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">Your review</label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this expert"
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReviewModal;
