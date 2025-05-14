
import React, { useState } from 'react';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ExpertReportModalProps {
  expertId: string | number;
  expertName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ExpertReportModal: React.FC<ExpertReportModalProps> = ({
  expertId,
  expertName,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { reportExpert } = useUserAuth();
  const [reason, setReason] = useState<string>('inappropriate-behavior');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason for reporting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert expertId to number if it's a string
      const numericExpertId = typeof expertId === 'string' ? parseInt(expertId, 10) : expertId;
      
      const success = await reportExpert({
        expertId: numericExpertId,
        reason,
        details
      });
      
      if (success) {
        toast.success('Report submitted successfully');
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('An error occurred while submitting your report');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {expertName}</DialogTitle>
          <DialogDescription>
            Please let us know why you're reporting this expert. All reports are confidential.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label>Reason for reporting</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate-behavior" id="behavior" />
                <Label htmlFor="behavior">Inappropriate behavior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional-concerns" id="professional" />
                <Label htmlFor="professional">Professional concerns</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="misrepresentation" id="misrepresentation" />
                <Label htmlFor="misrepresentation">Misrepresentation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Additional details</Label>
            <Textarea
              id="details"
              placeholder="Please provide more information about the issue"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleSubmit}
            disabled={isSubmitting || !details}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : 'Submit Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReportModal;
