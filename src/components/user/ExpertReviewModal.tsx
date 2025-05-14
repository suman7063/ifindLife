
import React, { useState } from 'react';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/StarRating';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ExpertReviewModalProps {
  expertId: string | number;
  expertName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ExpertReviewModal: React.FC<ExpertReviewModalProps> = ({
  expertId,
  expertName,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { addReview } = useUserAuth();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Please provide a rating');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert expertId to number if it's a string
      const numericExpertId = typeof expertId === 'string' ? parseInt(expertId, 10) : expertId;
      
      const success = await addReview({
        expertId: numericExpertId,
        rating,
        comment
      });
      
      if (success) {
        toast.success('Review submitted successfully');
        onOpenChange(false);
        if (onSuccess) onSuccess();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate your experience with {expertName}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex flex-col space-y-2 items-center justify-center">
            <StarRating 
              value={rating} 
              onChange={setRating} 
              size="large" 
            />
            <p className="text-sm text-muted-foreground mt-2">
              {rating === 5 ? 'Excellent' : 
               rating === 4 ? 'Very Good' :
               rating === 3 ? 'Good' :
               rating === 2 ? 'Fair' :
               rating === 1 ? 'Poor' : 'Tap to rate'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Share your experience (optional)</Label>
            <Textarea
              id="comment"
              placeholder="What was your experience like?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : 'Submit Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReviewModal;
