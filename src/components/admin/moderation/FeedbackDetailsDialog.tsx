
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReviewUI } from '@/types/supabase/reviews';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
          <DialogDescription>
            Submitted on {format(new Date(feedback.date), 'MMMM d, yyyy')} • ID: {feedback.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Status:</div>
            <div className="col-span-3">
              <Badge variant={feedback.verified ? "default" : "outline"}>
                {feedback.verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">User:</div>
            <div className="col-span-3">
              <div className="font-semibold">{feedback.userName || 'Anonymous User'}</div>
              {feedback.userId && (
                <div className="text-sm text-muted-foreground">
                  ID: {feedback.userId}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Expert:</div>
            <div className="col-span-3">
              <div className="font-semibold">{feedback.expertName || 'Unknown Expert'}</div>
              <div className="text-sm text-muted-foreground">
                ID: {feedback.expertId}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Rating:</div>
            <div className="col-span-3">
              {renderStars(feedback.rating)}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1 font-medium text-sm">Comment:</div>
            <div className="col-span-3 bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
              {feedback.comment || 'No comment provided.'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDetailsDialog;
