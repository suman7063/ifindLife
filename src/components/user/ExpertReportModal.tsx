
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserAuth } from '@/hooks/user-auth/useUserAuth';
import { toast } from '@/hooks/use-toast';
import { normalizeExpertId } from '@/utils/userProfileAdapter';

interface ExpertReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertId: string | number;
  expertName: string;
}

const reportReasons = [
  'Inappropriate behavior',
  'Misleading information',
  'Poor service quality',
  'No-show for appointment',
  'Other'
];

const ExpertReportModal: React.FC<ExpertReportModalProps> = ({
  isOpen,
  onClose,
  expertId,
  expertName
}) => {
  const { reportExpert } = useUserAuth();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: 'Missing information',
        description: 'Please select a reason for your report',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const normalizedExpertId = normalizeExpertId(expertId);
      const success = await reportExpert({
        expertId: normalizedExpertId,
        reason,
        details
      });
      
      if (success) {
        toast({
          title: 'Report submitted',
          description: 'Thank you for your feedback. We will review your report.'
        });
        onClose();
      } else {
        toast({
          title: 'Failed to submit report',
          description: 'Please try again later',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setReason('');
    setDetails('');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {expertName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">Reason for report</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium">Additional details</label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide more information about your report"
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertReportModal;
