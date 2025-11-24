import React from 'react';
import UserCallInterface from '@/components/call/UserCallInterface';
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
    closeChatModal,
    closeCallModal
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

      {/* Call Modal */}
      {/* Keep UserCallInterface mounted if call is in progress, even if isCallModalOpen is false */}
      {(state.isCallModalOpen || state.selectedExpert) && state.selectedExpert && (
        <UserCallInterface
          isOpen={state.isCallModalOpen}
          onClose={closeCallModal}
          expertId={state.selectedExpert.auth_id || state.selectedExpert.id}
          expertAuthId={state.selectedExpert.auth_id || state.selectedExpert.id}
          expertName={state.selectedExpert.name}
          expertAvatar={state.selectedExpert.profilePicture}
          expertPrice={state.selectedExpert.price || 30}
        />
      )}

      {/* Chat Modal */}
      {state.isChatModalOpen && state.selectedExpert && (
        <ChatOnlyModal
          isOpen={state.isChatModalOpen}
          onClose={closeChatModal}
          expert={{
            id: state.selectedExpert.id,
            auth_id: state.selectedExpert.auth_id,
            name: state.selectedExpert.name,
            profile_picture: state.selectedExpert.profilePicture
          }}
        />
      )}
    </>
  );
};

export default UnifiedExpertConnection;