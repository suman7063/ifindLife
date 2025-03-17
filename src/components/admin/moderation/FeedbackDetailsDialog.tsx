
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import { ReviewUI } from '@/types/supabase/reviews';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface FeedbackDetailsDialogProps {
  feedback: ReviewUI;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FeedbackDetailsDialog: React.FC<FeedbackDetailsDialogProps> = ({
  feedback,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogDescription>
            Detailed information about the user feedback
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">From</h3>
              <p className="text-sm font-medium">{feedback.userName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">For</h3>
              <p className="text-sm font-medium">{feedback.expertName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p className="text-sm">
                {format(new Date(feedback.date), 'PPP')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              {feedback.verified ? (
                <Badge className="mt-1 bg-green-100 text-green-800">Verified</Badge>
              ) : (
                <Badge className="mt-1 bg-yellow-100 text-yellow-800" variant="outline">Unverified</Badge>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Rating</h3>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= feedback.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2">{feedback.rating}/5</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Comment</h3>
            <div className="mt-2 p-3 border rounded-md bg-muted/20">
              <p className="text-sm whitespace-pre-wrap">{feedback.comment || "No comment provided"}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDetailsDialog;
