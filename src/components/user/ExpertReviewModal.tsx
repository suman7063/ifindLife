import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Star } from 'lucide-react';

interface ExpertReviewModalProps {
  expertId: string | number;
}

const ExpertReviewModal: React.FC<ExpertReviewModalProps> = ({ expertId }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser: user, addReview } = useUserAuth();

  const handleSubmit = async () => {
    if (!user || !expertId || rating === 0) {
      return;
    }

    setSubmitting(true);

    try {
      const reviewData = {
        expert_id: Number(expertId),
        rating: rating,
        comment: reviewText
      };

      const success = await addReview(reviewData);

      if (success) {
        toast.success('Review submitted successfully!');
        setOpen(false);
        setRating(0);
        setReviewText('');
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          Write a Review
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Review this Expert</AlertDialogTitle>
          <AlertDialogDescription>
            Share your experience to help others make informed decisions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[100px_1fr] items-start gap-4">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="col-span-1"
              placeholder="Write your review here"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={submitting} onClick={handleSubmit}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExpertReviewModal;
