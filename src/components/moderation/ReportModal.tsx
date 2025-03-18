
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportReason } from '@/types/supabase/moderation';
import { useReports } from '@/hooks/auth/useReports';

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: string;
  targetType: string;
  targetName: string;
  reporterId: string;
  reporterType: string;
}

const REPORT_REASONS = [
  { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
  { value: 'false_information', label: 'False Information' },
  { value: 'unqualified', label: 'Unqualified for Services' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'fake_account', label: 'Fake Account' },
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'misleading', label: 'Misleading Information' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Other' },
];

const ReportModal: React.FC<ReportModalProps> = ({
  open,
  onOpenChange,
  targetId,
  targetType,
  targetName,
  reporterId,
  reporterType,
}) => {
  const [reason, setReason] = useState<ReportReason>('inappropriate_behavior');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { submitReport } = useReports();
  
  const handleSubmit = async () => {
    if (!reason) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await submitReport(
        reporterId,
        reporterType,
        targetId,
        targetType,
        reason,
        details
      );
      
      if (success) {
        onOpenChange(false);
        // Reset form
        setReason('inappropriate_behavior');
        setDetails('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report {targetType}</DialogTitle>
          <DialogDescription>
            Submit a report about {targetName}. Our moderation team will review it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Report</label>
            <Select
              value={reason}
              onValueChange={(value) => setReason(value as ReportReason)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Details
            </label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide specific details about your report..."
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!reason || details.length < 10 || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
