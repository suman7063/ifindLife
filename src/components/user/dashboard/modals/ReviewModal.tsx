import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Review {
  id: string;
  expert_id: number;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  expert_name?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review?: Review | null;
  session?: any; // For new reviews from completed sessions
  userId: string;
  userName: string;
  onReviewSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  review,
  session,
  userId,
  userName,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    } else {
      setRating(5);
      setComment('');
    }
  }, [review]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      
      const reviewData = {
        user_id: userId,
        expert_id: review ? review.expert_id : (session ? parseInt(session.expert_id) : 0),
        rating,
        comment: comment.trim(),
        date: new Date().toISOString().split('T')[0],
        verified: true,
        user_name: userName
      };

      if (review) {
        // Update existing review
        const { error } = await supabase
          .from('user_reviews')
          .update(reviewData)
          .eq('id', review.id)
          .eq('user_id', userId);

        if (error) throw error;
        toast.success('Review updated successfully');
      } else {
        // Create new review
        const { error } = await supabase
          .from('user_reviews')
          .insert(reviewData);

        if (error) throw error;
        toast.success('Review submitted successfully');
      }

      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoveredStar || rating);
      
      return (
        <Star
          key={i}
          className={`h-8 w-8 cursor-pointer transition-colors ${
            isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
        />
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {review ? 'Edit Review' : 'Write a Review'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Rate your experience
            </label>
            <div className="flex gap-1">
              {renderStars()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Share your experience (optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this expert..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white"
            >
              {loading ? 'Submitting...' : (review ? 'Update Review' : 'Submit Review')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;