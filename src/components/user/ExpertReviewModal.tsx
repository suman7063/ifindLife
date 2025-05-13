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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useToast } from "@/components/ui/use-toast"
import { useUserAuth } from '@/hooks/user-auth';
import { NewReview } from '@/types/supabase/tables';

interface ExpertReviewModalProps {
  expertId: string;
  expertName: string;
}

const ExpertReviewModal: React.FC<ExpertReviewModalProps> = ({ expertId, expertName }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const { toast } = useToast();
  const { addReview, currentUser } = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userName = currentUser?.name || 'Anonymous';
  const userId = currentUser?.id;

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: "Please provide a rating.",
      });
      return;
    }

    if (!reviewText) {
      toast({
        title: "Please provide a review.",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "You must be logged in to leave a review.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData: NewReview = {
        user_id: userId,
        expert_id: expertId, // Change from expertId to expert_id
        rating: rating,
        comment: reviewText,
        user_name: userName,
        date: new Date().toISOString()
      };

      const success = await addReview(reviewData);
      if (success) {
        toast({
          title: "Review submitted successfully.",
        });
        setOpen(false);
        setRating(null);
        setReviewText('');
      } else {
        toast({
          title: "Failed to submit review.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "An error occurred while submitting the review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          Leave a Review
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Review {expertName}</AlertDialogTitle>
          <AlertDialogDescription>
            What was your experience like?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <Rating value={rating} onChange={setRating} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Review
            </Label>
            <Textarea id="comment" value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExpertReviewModal;
