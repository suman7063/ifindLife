
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useReports } from '@/hooks/auth/useReports';
import ReportModal from '@/components/moderation/ReportModal';

interface UserReportButtonProps {
  expertId: string;
  expertName: string;
}

const UserReportButton: React.FC<UserReportButtonProps> = ({ expertId, expertName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useUserAuth();
  const { submitReport } = useReports();

  const handleReport = (reason: string, details: string) => {
    if (!currentUser) {
      // Handle not logged in state
      return;
    }

    return submitReport(currentUser, expertId, reason, details);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsModalOpen(true)}
        className="text-gray-500 hover:text-red-500 transition-colors"
      >
        <Flag className="w-4 h-4 mr-2" />
        Report
      </Button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReport}
        targetName={expertName}
        targetType="expert"
      />
    </>
  );
};

export default UserReportButton;
