
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useAgoraCall } from '@/hooks/useAgoraCall';
import AgoraCallControls from './call/AgoraCallControls';
import AgoraCallTypeSelector from './call/AgoraCallTypeSelector';
import AgoraCallContent from './call/AgoraCallContent';
import { useUserAuth } from '@/hooks/useUserAuth';

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
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended'>('choosing');
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    callState,
    callType,
    duration,
    cost,
    remainingTime,
    isExtending,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime
  } = useAgoraCall(expert.id, expert.price);
  
  // Reset status when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setCallStatus('choosing');
      setShowChat(false);
      setIsFullscreen(false);
    }
  }, [isOpen]);
  
  // Handle fullscreen toggle
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen]);
  
  // Initiate call
  const handleInitiateCall = async (selectedCallType: 'audio' | 'video') => {
    setCallStatus('connecting');
    
    const success = await startCall(selectedCallType);
    
    if (success) {
      setCallStatus('connected');
      toast.success(`${selectedCallType.charAt(0).toUpperCase() + selectedCallType.slice(1)} call connected`);
    } else {
      setCallStatus('choosing');
      toast.error('Failed to connect call');
    }
  };
  
  // End call
  const handleEndCall = async () => {
    const result = await endCall();
    
    if (result.success) {
      setCallStatus('ended');
      toast.success(`Call ended. Duration: ${formatTime(result.duration)}`);
      
      if (result.cost > 0) {
        toast.info(`Call cost: ₹${result.cost.toFixed(2)}`);
      }
    } else {
      toast.error('Error ending call');
    }
  };
  
  // Toggle chat
  const handleToggleChat = () => {
    setShowChat(prev => !prev);
  };
  
  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else if (containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    }
  };
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && callStatus === 'connected') {
          // Confirm before closing if call is in progress
          if (window.confirm('Are you sure you want to end the call?')) {
            handleEndCall();
            onClose();
          }
        } else if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent 
        ref={containerRef} 
        className={`${isFullscreen ? 'w-screen h-screen max-w-none rounded-none' : 'sm:max-w-[600px]'} ${showChat && callStatus === 'connected' ? 'sm:max-w-[900px]' : ''}`}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            {callStatus === 'choosing' ? 'Choose Call Type' : 
             callStatus === 'connecting' ? 'Connecting...' : 
             callStatus === 'connected' ? `Call with ${expert.name}` : 
             'Call Ended'}
          </DialogTitle>
          {callStatus !== 'choosing' && (
            <DialogDescription className="text-center">
              {callStatus === 'connecting' ? 
                `Connecting to ${expert.name}...` : 
                callStatus === 'connected' ? 
                `Connected with ${expert.name} (₹${expert.price}/min)` : 
                `Call with ${expert.name} ended`}
            </DialogDescription>
          )}
        </DialogHeader>
        
        {callStatus === 'choosing' ? (
          <AgoraCallTypeSelector 
            expert={expert}
            onSelectCallType={handleInitiateCall}
          />
        ) : (
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
        )}
        
        {callStatus !== 'choosing' && (
          <DialogFooter className="flex justify-center space-x-4">
            <AgoraCallControls 
              callState={callState}
              callType={callType}
              isExtending={isExtending}
              onToggleMute={handleToggleMute}
              onToggleVideo={handleToggleVideo}
              onEndCall={handleEndCall}
              onExtendCall={extendCall}
              onToggleChat={handleToggleChat}
              onToggleFullscreen={handleToggleFullscreen}
            />
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgoraCallModal;
