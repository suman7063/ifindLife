
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';

interface ExpertReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: number;
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
  const [submitting, setSubmitting] = useState(false);
  const { addReview } = useUserAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const success = await addReview(expertId, rating, comment);
      if (success) {
        toast({
          title: "Review Submitted",
          description: "Thank you for sharing your experience!",
        });
        onClose();
      } else {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your review. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rate your session with {expertName}</DialogTitle>
          <DialogDescription>
            Your feedback helps us improve the quality of our services.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${
                  star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          
          <Textarea
            placeholder="Share your experience with this expert..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="bg-ifind-aqua hover:bg-ifind-teal text-white"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReviewModal;
