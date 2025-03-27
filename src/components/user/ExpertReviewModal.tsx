
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';

interface ExpertReviewModalProps {
  expertId: string;
  expertName: string;
}

const ExpertReviewModal: React.FC<ExpertReviewModalProps> = ({ expertId, expertName }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addReview, hasTakenServiceFrom, currentUser } = useUserAuth();
  
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (comment.trim() === '') {
      toast.error('Please add a comment');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await addReview(expertId, rating, comment);
      if (success) {
        setOpen(false);
        setRating(0);
        setComment('');
        toast.success('Review submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if the user has taken service from this expert
  const canReview = hasTakenServiceFrom(expertId);
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={(e) => {
            if (!canReview) {
              e.preventDefault();
              toast.error('You can only review experts after taking their service');
            }
          }}
          disabled={!canReview}
        >
          Add Review
        </Button>
      </DialogTrigger>
      
      {canReview && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review {expertName}</DialogTitle>
            <DialogDescription>
              Share your experience with this expert. Your feedback helps others in the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
            
            <Textarea
              placeholder="Share your experience with this expert..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-ifind-aqua hover:bg-ifind-teal transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ExpertReviewModal;
