
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import AgoraCallInfo from '../AgoraCallInfo';
import CallErrorMessage from './CallErrorMessage';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import CallAuthMessage from './CallAuthMessage';
import AgoraCallChat from '../AgoraCallChat';
import AgoraCallModalHeader from './AgoraCallModalHeader';
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/expert';
import { useCallState } from '@/hooks/call/useCallState';
import { useAgoraCall } from '@/hooks/useAgoraCall';

interface AgoraCallModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  expertId?: string | number;
  userId?: string;
  userName?: string;
  currentUser?: UserProfile | null;
  expert?: ExpertProfile | null;
}

const AgoraCallModal: React.FC<AgoraCallModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  expertId, 
  userId,
  userName,
  currentUser,
  expert
}) => {
  const { callState, setCallState } = useCallState();
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [showChat, setShowChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [callError, setCallError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const agoraCall = useAgoraCall({
    expertId: expertId?.toString() ?? '',
    userId: userId ?? '',
    callType,
    onError: (error) => {
      setCallError(error);
      setCallState(prev => ({...prev, hasError: true}));
    }
  });

  const {
    duration,
    cost,
    remainingTime,
    isExtending,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime,
  } = agoraCall;

  // Start call handler
  const handleStartCall = async () => {
    if (!currentUser) {
      setCallError('You must be logged in to start a call');
      return;
    }
    
    if (!expert) {
      setCallError('Expert not found');
      return;
    }
    
    setCallError(null);
    setCallState(prev => ({...prev, isConnecting: true, hasError: false}));
    
    try {
      await startCall();
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallError('Failed to establish connection');
      setCallState(prev => ({
        ...prev, 
        isConnecting: false, 
        hasError: true
      }));
    }
  };

  // End call handler
  const handleEndCall = () => {
    endCall();
    
    // Close modal after slight delay
    setTimeout(() => {
      onOpenChange(false);
    }, 500);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Update login status when currentUser changes
  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  // Set a call status based on the current state
  const getCallStatus = (): 'choosing' | 'connecting' | 'connected' | 'ended' | 'error' => {
    if (callError || callState.hasError) return 'error';
    if (callState.isConnecting) return 'connecting';
    if (callState.isConnected) return 'connected';
    return 'choosing';
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 overflow-hidden flex flex-col">
        <AgoraCallModalHeader 
          expert={expert}
          expertName={expert?.name}
          callStatus={getCallStatus()}
          currency="INR"
          expertPrice={expert?.price_per_min || 0}
          duration={formatTime(duration)}
          cost={cost}
          remainingTime={formatTime(remainingTime)}
          onClose={callState.isConnected ? handleEndCall : () => onOpenChange(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isLoggedIn ? (
            <CallAuthMessage expertName={expert?.name || 'the expert'} onClose={() => onOpenChange(false)} />
          ) : callError ? (
            <CallErrorMessage errorMessage={callError} onRetry={handleStartCall} onClose={() => onOpenChange(false)} />
          ) : !callState.isConnected ? (
            <AgoraCallInfo
              expert={expert}
              expertName={expert?.name}
              expertPrice={expert?.price_per_min}
              onCallTypeChange={setCallType}
              selectedCallType={callType}
              onStartCall={handleStartCall}
              isConnecting={callState.isConnecting}
            />
          ) : (
            <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className={`flex-1 ${showChat ? 'hidden md:block md:w-2/3' : 'w-full'}`}>
                <AgoraCallContent
                  callState={callState}
                  expertName={expert?.name || 'Expert'}
                  userName={userName || currentUser?.name || "You"}
                />
              </div>
              
              {showChat && (
                <div className="w-full md:w-1/3 border-l">
                  <AgoraCallChat
                    expertId={expertId?.toString()}
                    userId={currentUser?.id}
                    userName={currentUser?.name}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        {callState.isConnected && (
          <AgoraCallControls
            callState={callState}
            callType={callType}
            isMuted={callState.isMuted}
            isVideoEnabled={callState.isVideoEnabled}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onEndCall={handleEndCall}
            onToggleChat={() => setShowChat(!showChat)}
            showChat={showChat}
            remainingSeconds={remainingTime}
            onExtendCall={() => extendCall(5)} // Extend by 5 minutes
            isExtending={isExtending}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        )}
        
        {callState.isConnected && remainingTime < 60 && (
          <div className="bg-red-100 p-2 text-center flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-500 font-medium">
              Call ending soon! {formatTime(remainingTime)} remaining.
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => extendCall(5)} 
              className="ml-2"
              disabled={isExtending}
            >
              {isExtending ? 'Extending...' : 'Extend 5 min'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AgoraCallModal;
