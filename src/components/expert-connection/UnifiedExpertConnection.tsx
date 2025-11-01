import React from 'react';
import ExpertDetailModal from '@/components/expert-card/ExpertDetailModal';
import EnhancedAgoraCallModal from '@/components/call/modals/EnhancedAgoraCallModal';
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

      {/* Call Modal - Use EnhancedAgoraCallModal which has full call integration */}
      {state.isCallModalOpen && state.selectedExpert && (
        <EnhancedAgoraCallModal
          isOpen={state.isCallModalOpen}
          onClose={closeCallModal}
          expert={{
            id: state.selectedExpert.id, // Keep as UUID string, don't parse to int
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