
import React from 'react';
import { normalizeExpertForDetail } from '@/utils/expertDetailUtils';

/**
 * A wrapper component that ensures the expert object has all required properties
 * before passing it to ExpertReviewModal or ExpertReportModal
 */
interface ExpertModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (arg1: any, arg2: any) => Promise<void>;
  expertName: string;
  Component: React.ComponentType<any>;
}

const ExpertModalWrapper: React.FC<ExpertModalWrapperProps> = ({
  isOpen,
  onClose,
  onSubmit,
  expertName,
  Component
}) => {
  return (
    <Component
      open={isOpen}
      onOpenChange={onClose}
      onSubmit={onSubmit}
      expertName={expertName}
    />
  );
};

export default ExpertModalWrapper;
