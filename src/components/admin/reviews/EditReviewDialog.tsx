
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Review } from '@/types/supabase/reviews';

interface EditReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  editedRating: number;
  editedComment: string;
  setEditedRating: (rating: number) => void;
  setEditedComment: (comment: string) => void;
  onSave: () => void;
}

const EditReviewDialog: React.FC<EditReviewDialogProps> = ({
  open,
  onOpenChange,
  review,
  editedRating,
  editedComment,
  setEditedRating,
  setEditedComment,
  onSave
}) => {
  if (!review) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Make changes to the review rating and comment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="font-medium text-sm">Rating</div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= editedRating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setEditedRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-sm">Comment</div>
            <Textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditReviewDialog;
