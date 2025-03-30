
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAgoraCall } from '@/hooks/useAgoraCall';
import { useUserAuth } from '@/hooks/useUserAuth';
import AgoraCallControls from '@/components/call/AgoraCallControls';
import AgoraCallContent from '@/components/call/AgoraCallContent';
import AgoraCallModalHeader from './AgoraCallModalHeader';
import AgoraCallTypeSelector from '@/components/call/AgoraCallTypeSelector';
import CallAuthMessage from './CallAuthMessage';
import CallErrorMessage from './CallErrorMessage';
import { toast } from 'sonner';

interface AgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const AgoraCallModal: React.FC<AgoraCallModalProps> = ({ isOpen, onClose, expert }) => {
  const { currentUser } = useUserAuth();
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  
  const {
    callState,
    callType,
    duration,
    cost,
    remainingTime,
    isExtending,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime
  } = useAgoraCall(expert.id, expert.price);
  
  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      if (dialogRef.current?.requestFullscreen) {
        dialogRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // Listen for fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle chat toggle
  const handleToggleChat = () => {
    setShowChat(!showChat);
  };
  
  // Handle starting a call
  const handleStartCall = async (type: 'audio' | 'video') => {
    setCallStatus('connecting');
    
    const success = await startCall(type);
    
    if (success) {
      setCallStatus('connected');
      toast.success(`Call connected with ${expert.name}`);
    } else {
      setCallStatus('error');
    }
  };
  
  // Handle ending a call
  const handleEndCall = async () => {
    const { success, cost } = await endCall();
    
    if (success) {
      toast.info(`Call ended. Total cost: ₹${cost.toFixed(2)}`);
    }
    
    setCallStatus('ended');
    setShowChat(false);
  };
  
  // Reset state when modal is closed
  const handleCloseModal = () => {
    // If call is active, end it first
    if (callStatus === 'connected') {
      handleEndCall();
    }
    
    // Reset state for next call
    setTimeout(() => {
      setCallStatus('choosing');
      setShowChat(false);
      setIsFullscreen(false);
      onClose();
    }, 500);
  };
  
  // Check if user is authenticated
  const isAuthenticated = !!currentUser;
  
  // Render appropriate content based on call status
  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <CallAuthMessage 
          expertName={expert.name} 
          onClose={handleCloseModal} 
        />
      );
    }
    
    if (callStatus === 'choosing') {
      return (
        <AgoraCallTypeSelector 
          expert={expert} 
          onSelectCallType={handleStartCall} 
        />
      );
    }
    
    if (callStatus === 'error') {
      return (
        <CallErrorMessage 
          errorMessage={callError} 
          onRetry={() => setCallStatus('choosing')} 
        />
      );
    }
    
    return (
      <AgoraCallContent
        callState={callState}
        callStatus={callStatus}
        showChat={showChat}
        duration={duration}
        remainingTime={remainingTime}
        cost={cost}
        formatTime={formatTime}
        expertPrice={expert.price}
        userName={currentUser?.name || 'You'}
        expertName={expert.name}
      />
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleCloseModal()}>
      <DialogContent 
        ref={dialogRef}
        className={`sm:max-w-[700px] p-0 ${isFullscreen ? 'w-screen h-screen rounded-none' : ''}`}
      >
        <div className="p-6">
          <AgoraCallModalHeader 
            callStatus={callStatus}
            expertName={expert.name}
            currency="₹"
            expertPrice={expert.price}
          />
          
          <div className="my-6">
            {renderContent()}
          </div>
          
          {(callStatus === 'connected' || callStatus === 'ended') && (
            <div className="flex justify-center">
              <AgoraCallControls
                callState={callState}
                callType={callType}
                isExtending={isExtending}
                isFullscreen={isFullscreen}
                onToggleMute={handleToggleMute}
                onToggleVideo={handleToggleVideo}
                onEndCall={handleEndCall}
                onExtendCall={extendCall}
                onToggleChat={handleToggleChat}
                onToggleFullscreen={handleToggleFullscreen}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgoraCallModal;
