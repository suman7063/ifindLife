
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import AgoraCallInfo from '../AgoraCallInfo';
import CallErrorMessage from './CallErrorMessage';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CallAuthMessage from './CallAuthMessage';
import AgoraCallChat from '../AgoraCallChat';
import AgoraCallModalHeader from './AgoraCallModalHeader';
import { UserProfile } from '@/types/supabase/userProfile';
import { ExpertProfile } from '@/types/supabase/expert';
import { useCallState } from '@/hooks/call/useCallState';
import { useAgoraCall } from '@/hooks/useAgoraCall';

interface AgoraCallModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  expert?: {
    id: string;
    name: string;
    imageUrl?: string;
    price?: number;
  };
  userId?: string;
  userName?: string;
  currentUser?: UserProfile | null;
}

const AgoraCallModal: React.FC<AgoraCallModalProps> = ({ 
  isOpen, 
  onOpenChange, 
  expert,
  userId,
  userName,
  currentUser
}) => {
  const { callState, setCallState } = useCallState();
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [showChat, setShowChat] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);
  const [callError, setCallError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const agoraCall = useAgoraCall({
    expertId: expert?.id ?? '',
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
    extendCall,
    formatTime,
    startCall,
    endCall
  } = agoraCall;

  // Start call handler
  const handleStartCall = async () => {
    if (!currentUser) {
      setCallError('You must be logged in to start a call');
      return false;
    }
    
    if (!expert) {
      setCallError('Expert not found');
      return false;
    }
    
    setCallError(null);
    setCallState(prev => ({...prev, isConnecting: true, hasError: false}));
    
    try {
      return await startCall(callType);
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallError('Failed to establish connection');
      setCallState(prev => ({
        ...prev, 
        isConnecting: false, 
        hasError: true
      }));
      return false;
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
          expertName={expert?.name}
          callStatus={getCallStatus()}
          currency="INR"
          expertPrice={expert?.price || 0}
          duration={formatTime(duration)}
          cost={cost}
          remainingTime={formatTime(remainingTime)}
          onClose={callState.isConnected ? handleEndCall : () => onOpenChange(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isLoggedIn ? (
            <CallAuthMessage 
              expertName={expert?.name || 'the expert'} 
              onClose={() => onOpenChange(false)} 
            />
          ) : callError ? (
            <CallErrorMessage 
              errorMessage={callError} 
              onRetry={handleStartCall} 
              onClose={() => onOpenChange(false)} 
            />
          ) : !callState.isConnected ? (
            <AgoraCallInfo
              expertName={expert?.name}
              expertPrice={expert?.price}
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
                    userName={currentUser?.name}
                    expertName={expert?.name}
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
            onToggleMute={() => setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
            onToggleVideo={() => setCallState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }))}
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
