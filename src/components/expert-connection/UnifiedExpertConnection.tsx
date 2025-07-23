import React from 'react';
import ExpertDetailModal from '@/components/expert-card/ExpertDetailModal';
import LazyAgoraCallModal from '@/components/call/LazyAgoraCallModal';
import { useExpertConnection } from '@/hooks/useExpertConnection';

interface UnifiedExpertConnectionProps {
  children: (props: {
    state: ReturnType<typeof useExpertConnection>['state'];
    handleExpertCardClick: ReturnType<typeof useExpertConnection>['handleExpertCardClick'];
    handleConnectNow: ReturnType<typeof useExpertConnection>['handleConnectNow'];
    handleBookNow: ReturnType<typeof useExpertConnection>['handleBookNow'];
    handleShowConnectOptions: ReturnType<typeof useExpertConnection>['handleShowConnectOptions'];
  }) => React.ReactNode;
  serviceTitle?: string;
  serviceId?: string;
}

const UnifiedExpertConnection: React.FC<UnifiedExpertConnectionProps> = ({
  children,
  serviceTitle = "Expert Consultation",
  serviceId = "consultation"
}) => {
  const {
    state,
    currentSession,
    handleExpertCardClick,
    handleConnectNow,
    handleBookNow,
    handleShowConnectOptions,
    handleModalConnectNow,
    handleModalBookNow,
    closeExpertModal,
    closeCallModal
  } = useExpertConnection();

  return (
    <>
      {children({
        state,
        handleExpertCardClick,
        handleConnectNow,
        handleBookNow,
        handleShowConnectOptions
      })}

      {/* Expert Detail Modal removed - now using dedicated pages */}

      {/* Call Modal */}
      {state.isCallModalOpen && state.selectedExpert && currentSession && (
        <LazyAgoraCallModal
          isOpen={state.isCallModalOpen}
          onClose={closeCallModal}
          expert={{
            id: parseInt(state.selectedExpert.id),
            name: state.selectedExpert.name,
            imageUrl: state.selectedExpert.profilePicture || '',
            price: state.selectedExpert.price || 30
          }}
        />
      )}
    </>
  );
};

export default UnifiedExpertConnection;