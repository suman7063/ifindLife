
import React from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import AgoraChatTypeSelector from '@/components/chat/AgoraChatTypeSelector';
import AgoraCallContent from '@/components/chat/AgoraCallContent';
import AgoraCallControls from '@/components/chat/AgoraCallControls';
import CallAuthMessage from '@/components/chat/modals/CallAuthMessage';
import CallErrorMessage from '@/components/chat/modals/CallErrorMessage';
import { CallState } from '@/utils/agoraService';
import { ChatStatus, ChatType } from '@/hooks/chat/useChatModalState';

interface ChatModalContentProps {
  expertId: number;
  expertName: string;
  expertPrice: number;
  chatStatus: ChatStatus;
  chatType: ChatType;
  showChat: boolean;
  errorMessage: string | null;
  callState: CallState;
  callType: 'audio' | 'video';
  duration: number;
  cost: number;
  remainingFreeTime: number;
  isExtending: boolean;
  formatTime: (seconds: number) => string;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onStartChat: (type: 'text' | 'video') => void;
  onEndChat: () => void;
  onToggleChat: () => void;
  onRetry: () => void;
}

const ChatModalContent: React.FC<ChatModalContentProps> = ({
  expertId,
  expertName,
  expertPrice,
  chatStatus,
  chatType,
  showChat,
  errorMessage,
  callState,
  callType,
  duration,
  cost,
  remainingFreeTime,
  isExtending,
  formatTime,
  onToggleMute,
  onToggleVideo,
  onStartChat,
  onEndChat,
  onToggleChat,
  onRetry
}) => {
  const { isAuthenticated, isLoading: authLoading, userProfile } = useAuth();
  
  // Show auth message if not authenticated
  if (!isAuthenticated && !authLoading) {
    return <CallAuthMessage expertName={expertName} onClose={() => {}} />;
  }

  // Show error message
  if (chatStatus === 'error' && errorMessage) {
    return <CallErrorMessage 
      errorMessage={errorMessage} 
      onRetry={onRetry} 
    />;
  }

  // Type selection
  if (chatStatus === 'choosing') {
    return (
      <AgoraChatTypeSelector 
        expert={{ 
          id: expertId, 
          name: expertName, 
          imageUrl: '', 
          price: expertPrice 
        }} 
        onSelectChatType={onStartChat} 
      />
    );
  }

  // Connected or connecting
  return (
    <>
      <AgoraCallContent
        callState={callState}
        callStatus={chatStatus}
        showChat={showChat}
        duration={duration}
        remainingTime={remainingFreeTime}
        cost={cost}
        formatTime={formatTime}
        expertPrice={expertPrice}
        userName={userProfile?.name || 'You'}
        expertName={expertName}
      />
      
      {chatStatus === 'connected' && (
        <div className="flex justify-center mt-4">
          <AgoraCallControls
            callState={callState}
            callType={callType}
            isExtending={isExtending}
            isFullscreen={false}
            onToggleMute={onToggleMute}
            onToggleVideo={onToggleVideo}
            onEndCall={onEndChat}
            onExtendCall={() => {}}
            onToggleChat={onToggleChat}
            onToggleFullscreen={() => {}}
          />
        </div>
      )}
    </>
  );
};

export default ChatModalContent;
