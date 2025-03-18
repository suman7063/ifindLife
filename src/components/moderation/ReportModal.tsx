
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ReportReason } from '@/types/supabase/moderation';

export interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => Promise<boolean>;
  targetName: string;
  targetType: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  open,
  onClose,
  onSubmit,
  targetName,
  targetType
}) => {
  const [reason, setReason] = useState<ReportReason>('inappropriate_behavior');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(reason, details);
      if (success) {
        setReason('inappropriate_behavior');
        setDetails('');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report {targetType}</DialogTitle>
          <DialogDescription>
            Please provide details about why you're reporting {targetName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for reporting</Label>
            <RadioGroup 
              value={reason} 
              onValueChange={(value) => setReason(value as ReportReason)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate_behavior" id="inappropriate" />
                <Label htmlFor="inappropriate">Inappropriate behavior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false_information" id="false_info" />
                <Label htmlFor="false_info">False information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unqualified" id="unqualified" />
                <Label htmlFor="unqualified">Unqualified or misleading credentials</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="harassment" id="harassment" />
                <Label htmlFor="harassment">Harassment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
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
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !details.trim()}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
