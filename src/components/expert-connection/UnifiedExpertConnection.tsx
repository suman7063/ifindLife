import React from 'react';
import ExpertDetailModal from '@/components/expert-card/ExpertDetailModal';
import LazyAgoraCallModal from '@/components/call/LazyAgoraCallModal';
import ChatOnlyModal from '@/components/chat/modals/ChatOnlyModal';
import { useExpertConnection } from '@/hooks/useExpertConnection';

interface UnifiedExpertConnectionProps {
  children: (props: {
    state: ReturnType<typeof useExpertConnection>['state'];
    handleExpertCardClick: ReturnType<typeof useExpertConnection>['handleExpertCardClick'];
    handleConnectNow: ReturnType<typeof useExpertConnection>['handleConnectNow'];
    handleBookNow: ReturnType<typeof useExpertConnection>['handleBookNow'];
    handleChat: ReturnType<typeof useExpertConnection>['handleChat'];
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
    handleChat,
    handleShowConnectOptions,
    handleModalConnectNow,
    handleModalBookNow,
    closeExpertModal,
    closeCallModal,
    closeChatModal
  } = useExpertConnection();

  return (
    <>
      {children({
        state,
        handleExpertCardClick,
        handleConnectNow,
        handleBookNow,
        handleChat,
        handleShowConnectOptions
      })}

      {/* Expert Detail Modal removed - now using dedicated pages */}

      {/* Call Modal - Open if session exists or if modal is requested (session will be created by modal if needed) */}
      {state.isCallModalOpen && state.selectedExpert && (
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

      {/* Chat Modal */}
      {state.isChatModalOpen && state.selectedExpert && (
        <ChatOnlyModal
          isOpen={state.isChatModalOpen}
          onClose={closeChatModal}
          expert={{
            id: state.selectedExpert.id,
            name: state.selectedExpert.name,
            profilePicture: state.selectedExpert.profilePicture,
            auth_id: state.selectedExpert.auth_id
          }}
        />
      )}
    </>
  );
};

export default UnifiedExpertConnection;