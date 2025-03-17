
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { toast } from 'sonner';
import { ReportReason } from '@/types/supabase/moderation';

interface UserReportButtonProps {
  expert: {
    id: string;
    name: string;
  };
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'misleading_information', label: 'Misleading Information' },
  { value: 'off_platform_redirection', label: 'Directing to Off-Platform Services' },
  { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
  { value: 'other', label: 'Other' }
];

const UserReportButton: React.FC<UserReportButtonProps> = ({ 
  expert, 
  children, 
  className = '',
  variant = 'outline' 
}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  
  const { reportExpert, isAuthenticated } = useUserAuth();
  
  const handleSubmit = () => {
    if (!reason) {
      toast.error('Please select a reason for the report');
      return;
    }
    
    if (!details.trim()) {
      toast.error('Please provide details about the issue');
      return;
    }
    
    reportExpert(expert.id, reason, details);
    setOpen(false);
    setReason('');
    setDetails('');
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          className={className}
          onClick={(e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              toast.error('Please sign in to report an expert');
            }
          }}
          disabled={!isAuthenticated}
        >
          {children || (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Expert
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report {expert.name}</DialogTitle>
          <DialogDescription>
            Please provide details about your concern. Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for Report
            </label>
            <Select 
              value={reason} 
              onValueChange={(value) => setReason(value as ReportReason)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium">
              Details
            </label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide specific details about the issue..."
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
    </Dialog>
  );
};

export default UserReportButton;
