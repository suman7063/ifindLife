
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { toast } from 'sonner';

interface ExpertReportModalProps {
  expertId: number;
  expertName: string;
}

const REPORT_REASONS = [
  'Inappropriate behavior',
  'Service not as described',
  'No-show for appointment',
  'Unprofessional conduct',
  'False expertise claim',
  'Other'
];

const ExpertReportModal: React.FC<ExpertReportModalProps> = ({ expertId, expertName }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [open, setOpen] = useState(false);
  
  const { reportExpert, hasTakenServiceFrom } = useUserAuth();
  
  const handleSubmit = () => {
    if (reason === '') {
      toast.error('Please select a reason');
      return;
    }
    
    if (details.trim() === '') {
      toast.error('Please provide details');
      return;
    }
    
    reportExpert(expertId, reason, details);
    setOpen(false);
    setReason('');
    setDetails('');
  };
  
  // Check if the user has taken service from this expert
  const canReport = hasTakenServiceFrom(expertId);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          onClick={() => {
            if (!canReport) {
              toast.error('You can only report experts after taking their service');
              return;
            }
          }}
          disabled={!canReport}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Expert
        </Button>
      </DialogTrigger>
      
      {canReport && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report {expertName}</DialogTitle>
            <DialogDescription>
              Please provide details about your concern. Reports are reviewed by our admin team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="report-reason" className="text-sm font-medium">
                Reason for Report
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="report-details" className="text-sm font-medium">
                Details
              </label>
              <Textarea
                id="report-details"
                placeholder="Please provide specific details about the issue..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-destructive hover:bg-destructive/90"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ExpertReportModal;
