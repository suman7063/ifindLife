
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ReportReason } from '@/types/supabase/moderation';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details: string) => void;
  targetName: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  targetName,
}) => {
  const [reason, setReason] = useState<ReportReason>(ReportReason.INAPPROPRIATE_BEHAVIOR);
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    onSubmit(reason, details);
    setReason(ReportReason.INAPPROPRIATE_BEHAVIOR);
    setDetails('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {targetName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Reason for report</Label>
            <RadioGroup value={reason} onValueChange={(value) => setReason(value as ReportReason)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.MISLEADING_INFORMATION} id="misleading" />
                <Label htmlFor="misleading">Misleading Information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.OFF_PLATFORM_REDIRECTION} id="redirection" />
                <Label htmlFor="redirection">Off-platform Redirection</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.INAPPROPRIATE_BEHAVIOR} id="inappropriate" />
                <Label htmlFor="inappropriate">Inappropriate Behavior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.BAD_BEHAVIOR} id="bad" />
                <Label htmlFor="bad">Bad Behavior</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.FOUL_LANGUAGE} id="foul" />
                <Label htmlFor="foul">Foul Language</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={ReportReason.OTHER} id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="details">Additional Details</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide more details about your report..."
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
