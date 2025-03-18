
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useReports } from '@/hooks/auth/useReports';
import { ReportReason } from '@/types/supabase/moderation';

interface UserReportButtonProps {
  expertId: string;
  expertName: string;
  variant?: "outline" | "link" | "default" | "destructive" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const UserReportButton: React.FC<UserReportButtonProps> = ({ 
  expertId, 
  expertName, 
  variant = "outline", 
  size = "sm",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | string>(ReportReason.MISLEADING_INFORMATION);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser } = useUserAuth();
  const { submitReport } = useReports();
  
  const handleSubmit = async () => {
    if (!currentUser) {
      alert('You must be logged in to report an expert');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitReport({
        userId: currentUser.id,
        expertId: expertId,
        reason: reason,
        details: details
      });
      
      setIsOpen(false);
      setReason(ReportReason.MISLEADING_INFORMATION);
      setDetails('');
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        onClick={() => setIsOpen(true)}
        className={className}
      >
        Report
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report {expertName}</DialogTitle>
            <DialogDescription>
              Please provide details about your concern. Our team will review your report promptly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Report</Label>
              <Select 
                value={reason} 
                onValueChange={(value) => setReason(value as ReportReason)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportReason.MISLEADING_INFORMATION}>Misleading Information</SelectItem>
                  <SelectItem value={ReportReason.OFF_PLATFORM_REDIRECTION}>Redirecting Off Platform</SelectItem>
                  <SelectItem value={ReportReason.INAPPROPRIATE_BEHAVIOR}>Inappropriate Behavior</SelectItem>
                  <SelectItem value={ReportReason.BAD_BEHAVIOR}>Unprofessional Conduct</SelectItem>
                  <SelectItem value={ReportReason.FOUL_LANGUAGE}>Offensive Language</SelectItem>
                  <SelectItem value={ReportReason.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                placeholder="Please provide specific details about your concern..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={!details.trim() || isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserReportButton;
