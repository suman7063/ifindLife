
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { useReports } from '@/hooks/auth/useReports';
import { useToast } from '@/hooks/use-toast';
import ReportModal from '../moderation/ReportModal';

interface UserReportButtonProps {
  expertId: string;
  expertName: string;
}

const UserReportButton: React.FC<UserReportButtonProps> = ({ expertId, expertName }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const { submitReport } = useReports();
  const { toast } = useToast();

  const handleReportSubmit = async (reason: string, details: string) => {
    try {
      const success = await submitReport(
        expertId,
        'expert',
        reason,
        details
      );
      
      if (success) {
        toast({
          title: "Report submitted",
          description: "Thank you for your feedback. We will review your report.",
          variant: "default",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "There was an error submitting your report. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-600 border-red-200 hover:bg-red-50"
        onClick={() => setShowReportModal(true)}
      >
        <Flag className="h-4 w-4 mr-1" />
        Report
      </Button>
      
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        targetName={expertName}
        targetType="Expert"
      />
    </>
  );
};

export default UserReportButton;
