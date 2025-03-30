
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Phone, PhoneCall, Video } from 'lucide-react';
import { useAgoraCall } from '@/hooks/useAgoraCall';
import AgoraVideoDisplay from './call/AgoraVideoDisplay';
import AgoraCallControls from './call/AgoraCallControls';
import AgoraCallInfo from './call/AgoraCallInfo';
import AgoraCallChat from './call/AgoraCallChat';
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
  const [selectedCallType, setSelectedCallType] = useState<'audio' | 'video'>('video');
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
  const handleInitiateCall = async () => {
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
        
        <div className={`flex ${showChat ? 'flex-row' : 'flex-col'} items-center py-3 space-y-4 space-x-0 ${showChat ? 'sm:space-x-4 sm:space-y-0' : ''}`}>
          {callStatus === 'choosing' ? (
            <div className="flex flex-col items-center space-y-6 w-full">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
                <img 
                  src={expert.imageUrl} 
                  alt={expert.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold">{expert.name}</h3>
                <p className="text-sm text-muted-foreground">₹{expert.price}/min after first 15 minutes</p>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={() => {
                    setSelectedCallType('audio');
                    handleInitiateCall();
                  }}
                  className="flex items-center space-x-2"
                  variant="outline"
                >
                  <Phone className="h-4 w-4" />
                  <span>Audio Call</span>
                </Button>
                
                <Button 
                  onClick={() => {
                    setSelectedCallType('video');
                    handleInitiateCall();
                  }}
                  className="flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Video Call</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className={`${showChat ? 'w-1/2' : 'w-full'} space-y-4`}>
                <AgoraVideoDisplay 
                  callState={callState}
                  userName={currentUser?.name || 'You'}
                  expertName={expert.name}
                />
                
                {callStatus === 'connected' && (
                  <AgoraCallInfo 
                    duration={duration}
                    remainingTime={remainingTime}
                    cost={cost}
                    formatTime={formatTime}
                    pricePerMinute={expert.price}
                  />
                )}
              </div>
              
              {showChat && callStatus === 'connected' && (
                <div className="w-1/2 h-[400px]">
                  <AgoraCallChat 
                    visible={showChat}
                    userName={currentUser?.name || 'You'}
                    expertName={expert.name}
                  />
                </div>
              )}
            </>
          )}
        </div>
        
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
