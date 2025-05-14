import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Expert } from '@/types/expert';
import { useUserAuth } from '@/hooks/user-auth';

interface ExpertReportModalProps {
  expert: Expert;
  children: React.ReactNode;
  onSubmitSuccess: () => void;
}

const ExpertReportModal: React.FC<ExpertReportModalProps> = ({ expert, children, onSubmitSuccess }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { reportExpert } = useUserAuth();

  const onClose = () => {
    setOpen(false);
    setReason('');
    setDetails('');
  };

  // Fix the issue with reportExpert call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let success = false;
      
      // Call reportExpert with the correct parameter
      if (typeof reportExpert === 'function') {
        success = await reportExpert({
          expertId: parseInt(expert.id.toString()),
          reason,
          details
        });
      }

      if (success) {
        onSubmitSuccess();
        toast.success("Report submitted successfully");
        onClose();
      } else {
        toast.error("Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("An error occurred while submitting your report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Expert</DialogTitle>
          <DialogDescription>
            Please provide details about why you are reporting this expert.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for reporting..."
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide additional details..."
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReportModal;
