
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag } from 'lucide-react';
import { toast } from 'sonner';
import { ReportUserType } from './types';

interface UserReportModalProps {
  user: {
    id: string;
    name: string;
  };
  onReport: (report: Omit<ReportUserType, 'id' | 'date' | 'status'>) => void;
}

const REPORT_REASONS = [
  'Abusive behavior',
  'Harassment',
  'Inappropriate messages',
  'Payment dispute',
  'No-show for appointment',
  'False information',
  'Other'
];

const UserReportModal: React.FC<UserReportModalProps> = ({ user, onReport }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error('Please select a reason for reporting');
      return;
    }
    
    if (!details.trim()) {
      toast.error('Please provide details about the issue');
      return;
    }
    
    onReport({
      user_id: user.id,
      expert_id: 0, // This will be filled by the service
      reason,
      details,
      userName: user.name // For display purposes
    });
    
    setOpen(false);
    setReason('');
    setDetails('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Flag className="h-4 w-4 mr-1 text-red-500" />
          Report User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Report User</DialogTitle>
            <DialogDescription>
              Report {user.name} for inappropriate behavior or other issues.
              Your report will be reviewed by our team.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Report
              </label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium">
                Provide Details
              </label>
              <Textarea
                id="details"
                placeholder="Please describe the issue in detail..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                Your report will be confidential and will help us maintain a professional environment.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white">
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserReportModal;
