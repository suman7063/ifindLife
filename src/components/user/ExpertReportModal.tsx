
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface ExpertReportModalProps {
  expertId: string | number;
  expertName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExpertReportModal: React.FC<ExpertReportModalProps> = ({
  expertId,
  expertName,
  open,
  onOpenChange
}) => {
  const { reportExpert } = useAuth();
  const [reason, setReason] = useState<string>('inappropriate_behavior');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!details.trim()) {
      toast.error('Please provide details about your report');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (reportExpert) {
        const success = await reportExpert({
          expertId: Number(expertId),
          reason,
          details
        });
        
        if (success) {
          toast('Report submitted successfully', {
            description: 'Thank you for your feedback. We will review it shortly.'
          });
          onOpenChange(false);
          setReason('inappropriate_behavior');
          setDetails('');
        } else {
          toast('Failed to submit report', {
            description: 'Please try again or contact customer support.'
          });
        }
      } else {
        toast('Reporting feature unavailable', {
          description: 'This feature is currently not available.'
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast('Error submitting report', {
        description: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report Expert: {expertName}</DialogTitle>
          <DialogDescription>
            Please provide details about why you are reporting this expert.
            Our team will review your report and take appropriate action.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for reporting</Label>
            <RadioGroup id="reason" value={reason} onValueChange={setReason}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate_behavior" id="r1" />
                <Label htmlFor="r1">Inappropriate behavior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false_information" id="r2" />
                <Label htmlFor="r2">False information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor_service" id="r3" />
                <Label htmlFor="r3">Poor service quality</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="r4" />
                <Label htmlFor="r4">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              placeholder="Please provide specific details about the issue..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReportModal;
