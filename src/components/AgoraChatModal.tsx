
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import AgoraChatTypeSelector from './call/AgoraChatTypeSelector';
import AgoraCallContent from './call/AgoraCallContent';
import AgoraCallControls from './call/AgoraCallControls';
import AgoraCallModalHeader from './call/modals/AgoraCallModalHeader';
import CallAuthMessage from './call/modals/CallAuthMessage';
import CallErrorMessage from './call/modals/CallErrorMessage';
import { useCallState } from '@/hooks/call/useCallState';
import { useCallTimer } from '@/hooks/call/useCallTimer';
import { useCallOperations } from '@/hooks/call/useCallOperations';

interface AgoraChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const AgoraChatModal: React.FC<AgoraChatModalProps> = ({
  isOpen,
  onClose,
  expert,
}) => {
  const { isAuthenticated, isLoading: authLoading, userProfile } = useAuth();
  const [chatStatus, setChatStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [chatType, setChatType] = useState<'text' | 'video'>('text');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const { callState, initializeCall, endCall } = useCallState();
  const {
    duration,
    remainingFreeTime,
    isPaused,
    cost,
    formatTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  } = useCallTimer(expert.price);

  const {
    join,
    leave,
    toggleMicrophone,
    toggleCamera,
    hasVideoPermission,
    hasMicrophonePermission,
  } = useCallOperations(callState);
  
  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setChatStatus('choosing');
        setChatType('text');
        setErrorMessage(null);
        setShowChat(false);
        resetTimer();
        endCall();
      }, 300);
    }
  }, [isOpen, resetTimer, endCall]);

  // Initialize chat
  const handleStartChat = async (selectedType: 'text' | 'video') => {
    try {
      setChatType(selectedType);
      setChatStatus('connecting');
      
      // Initialize the call/chat infrastructure
      await initializeCall({
        expertId: expert.id.toString(),
        expertName: expert.name,
        chatMode: true
      });
      
      setChatStatus('connected');
      startTimer();
      
    } catch (error: any) {
      console.error('Failed to start chat:', error);
      setErrorMessage('Failed to initialize chat session. Please try again.');
      setChatStatus('error');
    }
  };

  // End chat
  const handleEndChat = async () => {
    try {
      await leave();
      setChatStatus('ended');
      pauseTimer();
      toast.success('Chat ended successfully');
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error ending chat:', error);
      setErrorMessage('Failed to end chat properly. Please refresh the page.');
      setChatStatus('error');
    }
  };

  const handleToggleChatPanel = () => {
    setShowChat(!showChat);
  };

  // Modal content based on state
  const renderModalContent = () => {
    // Show auth message if not authenticated
    if (!isAuthenticated && !authLoading) {
      return <CallAuthMessage />;
    }

    // Show error message
    if (chatStatus === 'error' && errorMessage) {
      return <CallErrorMessage message={errorMessage} />;
    }

    // Type selection
    if (chatStatus === 'choosing') {
      return (
        <AgoraChatTypeSelector 
          expert={expert} 
          onSelectChatType={handleStartChat} 
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
          expertPrice={expert.price}
          userName={userProfile?.name || 'You'}
          expertName={expert.name}
        />
        
        {chatStatus === 'connected' && (
          <AgoraCallControls
            onEnd={handleEndChat}
            onToggleMic={toggleMicrophone}
            onToggleCamera={toggleCamera}
            onToggleChat={handleToggleChatPanel}
            isMuted={!callState.isAudioEnabled}
            isCameraOff={!callState.isVideoEnabled}
            showChatButton={true}
            isChatOpen={showChat}
            hasVideoPermission={hasVideoPermission}
            hasMicrophonePermission={hasMicrophonePermission}
          />
        )}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <AgoraCallModalHeader
          expertName={expert.name}
          expertImage={expert.imageUrl}
          status={chatStatus}
          serviceType="Chat"
        />
        
        <div className="p-4">
          {renderModalContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgoraChatModal;
