
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  targetName: string;
  targetType: 'expert' | 'user' | 'content';
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  targetName,
  targetType
}) => {
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      return;
    }
    
    setSubmitting(true);
    try {
      await onSubmit(reason, details);
      // Reset form
      setReason('');
      setDetails('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setReason('');
    setDetails('');
    onClose();
  };

  const getReasonOptions = () => {
    switch (targetType) {
      case 'expert':
        return [
          { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
          { value: 'false_information', label: 'False Information' },
          { value: 'unqualified', label: 'Seems Unqualified' },
          { value: 'harassment', label: 'Harassment' },
          { value: 'other', label: 'Other' }
        ];
      case 'user':
        return [
          { value: 'harassment', label: 'Harassment' },
          { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
          { value: 'fake_account', label: 'Fake Account' },
          { value: 'other', label: 'Other' }
        ];
      case 'content':
        return [
          { value: 'inappropriate', label: 'Inappropriate Content' },
          { value: 'misleading', label: 'Misleading Information' },
          { value: 'spam', label: 'Spam' },
          { value: 'other', label: 'Other' }
        ];
      default:
        return [
          { value: 'inappropriate', label: 'Inappropriate' },
          { value: 'other', label: 'Other' }
        ];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetForm}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report {targetType.charAt(0).toUpperCase() + targetType.slice(1)}</DialogTitle>
          <DialogDescription>
            Report {targetName} for violating our community guidelines
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {getReasonOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="details" className="text-right">
              Details
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide more details about your report"
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            disabled={!reason || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
