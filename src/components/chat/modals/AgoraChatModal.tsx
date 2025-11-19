
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useVideoMode } from '@/hooks/call/useVideoMode';
import { useTestAgoraCall } from '@/hooks/useTestAgoraCall';
import AgoraCallContent from '@/components/call/AgoraCallContent';
import AgoraCallControls from '@/components/call/AgoraCallControls';
import AgoraChatTypeSelector from '@/components/chat/AgoraChatTypeSelector';
import CallAuthMessage from '@/components/chat/modals/CallAuthMessage';
import CallErrorMessage from '@/components/chat/modals/CallErrorMessage';
import { useChatModalState } from '@/hooks/chat/useChatModalState';

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
  const { videoMode, toggleVideoMode } = useVideoMode();
  
  // Use test Agora call for demo purposes
  const {
    callState,
    duration,
    cost,
    remainingTime,
    callError,
    isConnecting,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    formatTime
  } = useTestAgoraCall(expert.auth_id, expert.price);

  // Use chat modal state management
  const {
    chatStatus,
    setChatStatus,
    chatType,
    setChatType,
    errorMessage,
    setErrorMessage,
    showChat,
    setShowChat,
    handleToggleChatPanel,
    handleRetry
  } = useChatModalState(isOpen, () => {}, endCall);

  // Enhanced state for call type
  const [selectedCallType, setSelectedCallType] = useState<'video' | 'audio'>('video');

  const handleStartChat = async (type: 'text' | 'video', selectedDuration: number = 15) => {
    try {
      console.log('🎯 Starting chat session:', { type, selectedDuration });
      
      setChatType(type);
      setChatStatus('connecting');
      setErrorMessage(null);

      if (type === 'text') {
        // For text chat, just show the chat interface
        setChatStatus('connected');
        setShowChat(true);
        return;
      }

      // For video chat, start the call
      const callType = selectedCallType === 'audio' ? 'voice' : 'video';
      const success = await startCall(selectedDuration, callType);
      
      if (success) {
        setChatStatus('connected');
        if (type === 'video') {
          setShowChat(false); // Start with video only, chat can be toggled
        }
      } else {
        setChatStatus('error');
        setErrorMessage(callError || 'Failed to start video chat');
      }
    } catch (error) {
      console.error('❌ Error starting chat:', error);
      setChatStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start chat');
    }
  };

  const handleEndChat = async () => {
    try {
      console.log('🛑 Ending chat session');
      
      if (chatType === 'video' && callState) {
        await endCall();
      }
      
      setChatStatus('ended');
      
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('❌ Error ending chat:', error);
      setChatStatus('error');
      setErrorMessage('Failed to end chat properly');
    }
  };

  const renderModalContent = () => {
    // Show auth message if not authenticated
    if (!isAuthenticated && !authLoading) {
      return <CallAuthMessage expertName={expert.name} onClose={onClose} />;
    }

    // Show error message
    if (chatStatus === 'error') {
      return (
        <CallErrorMessage 
          errorMessage={errorMessage || 'An error occurred'} 
          onRetry={handleRetry}
        />
      );
    }

    // Show chat type selector
    if (chatStatus === 'choosing') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Choose Chat Type</h3>
            <p className="text-muted-foreground mb-6">
              Start a conversation with {expert.name}
            </p>
          </div>
          
          <AgoraChatTypeSelector 
            expert={expert}
            onSelectChatType={(type) => {
              if (type === 'text') {
                handleStartChat('text');
              } else {
                handleStartChat('video', 15); // Default 15 minutes
              }
            }}
          />
        </div>
      );
    }

    // Show call completion message
    if (chatStatus === 'ended') {
      return (
        <div className="text-center py-8 space-y-4">
          <h3 className="text-lg font-semibold">Chat Session Completed</h3>
          {chatType === 'video' && (
            <>
              <p className="text-muted-foreground">Duration: {formatTime(duration)}</p>
              <p className="text-muted-foreground">Total Cost: ${cost.toFixed(2)}</p>
            </>
          )}
          <p className="text-sm text-muted-foreground">This window will close automatically.</p>
        </div>
      );
    }

    // Show chat content when connected or connecting
    return (
      <div className="space-y-4">
        {/* Enhanced call content with video modes and chat */}
        <AgoraCallContent
          callState={callState}
          callStatus={isConnecting ? 'connecting' : (callState?.isJoined ? 'connected' : chatStatus)}
          showChat={showChat || chatType === 'text'}
          videoMode={videoMode}
          duration={duration}
          remainingTime={remainingTime}
          cost={cost}
          formatTime={formatTime}
          expertPrice={expert.price}
          userName={userProfile?.name || 'You'}
          expertName={expert.name}
        />
        
        {/* Enhanced controls with video mode toggle */}
        {(chatStatus === 'connected' && (callState?.isJoined || chatType === 'text')) && (
          <div className="flex justify-center">
            <AgoraCallControls
              callState={callState}
              callType={chatType === 'video' ? selectedCallType : undefined}
              videoMode={videoMode}
              onToggleMute={handleToggleMute}
              onToggleVideo={handleToggleVideo}
              onEndCall={handleEndChat}
              onToggleChat={handleToggleChatPanel}
              onToggleVideoMode={toggleVideoMode}
              showChat={showChat || chatType === 'text'}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${(showChat || chatType === 'text') && chatStatus === 'connected' ? 'sm:max-w-6xl' : 'sm:max-w-4xl'} max-h-[90vh] overflow-hidden`}>
        <DialogHeader className="bg-gradient-to-r from-primary/5 to-accent/5 -mx-6 -mt-6 px-6 py-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {chatStatus === 'choosing' && `Connect with ${expert.name}`}
            {chatStatus === 'connecting' && `Connecting to ${expert.name}...`}
            {chatStatus === 'connected' && `${chatType === 'text' ? 'Chatting' : 'In call'} with ${expert.name}`}
            {chatStatus === 'ended' && `Session Completed`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderModalContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgoraChatModal;
