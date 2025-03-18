
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReportReason } from '@/types/supabase/moderation';
import useReports from '@/hooks/auth/useReports';
import { Flag } from 'lucide-react';
import ReportModal from '@/components/moderation/ReportModal';

interface UserReportButtonProps {
  targetId: string;
  targetType: 'expert' | 'user';
  targetName: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const UserReportButton: React.FC<UserReportButtonProps> = ({
  targetId,
  targetType,
  targetName,
  variant = 'outline',
  size = 'sm',
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addReport } = useReports();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleReportSubmit = async (reason: ReportReason, details: string) => {
    // We need to mock the user for now as we don't have the current user context
    const mockUser = { id: 'current-user-id' };
    await addReport(mockUser, targetId, reason, details);
    handleCloseModal();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenModal}
        className={`text-destructive hover:bg-destructive/10 ${className}`}
      >
        <Flag className="h-4 w-4 mr-1" />
        Report
      </Button>

      <ReportModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleReportSubmit}
        targetName={targetName}
      />
    </>
  );
};

export default UserReportButton;
