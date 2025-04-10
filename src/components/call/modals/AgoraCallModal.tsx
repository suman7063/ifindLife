
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expertId?: string | number;
  userId?: string;
  userName?: string;
  currentUser?: UserProfile | null;
  expert?: ExpertProfile | null;
}

const AgoraCallModal: React.FC<AgoraCallModalProps> = ({ 
  open, 
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
    isConnected,
    hasJoined,
    duration,
    cost,
    remainingTime,
    isExtending,
    connectToCall,
    disconnectFromCall,
    joinChannel,
    startTimers,
    stopTimers,
    extendCall,
    calculateFinalCost,
    formatTime,
  } = agoraCall;

  // Start call handler
  const startCall = async () => {
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
      await connectToCall();
      
      // Once connected, update UI state
      setCallState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: true
      }));
      
      // Start billing timer (assuming 15 minute call and rate of $2 per minute)
      const initialDuration = 15 * 60; // 15 minutes in seconds
      const ratePerMinute = 2; // $2 per minute
      startTimers(initialDuration, ratePerMinute);
      
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
  const endCall = () => {
    disconnectFromCall();
    stopTimers();
    const finalCost = calculateFinalCost();
    console.log(`Call ended. Duration: ${duration} seconds, Final cost: $${finalCost}`);
    
    setCallState(prev => ({
      ...prev,
      isConnected: false,
      isJoined: false
    }));
    
    // Close modal after slight delay
    setTimeout(() => {
      onOpenChange(false);
    }, 500);
  };

  // Handle mute/unmute
  const handleToggleMute = () => {
    setCallState(prev => ({...prev, isMuted: !prev.isMuted}));
    // Logic to mute/unmute local audio track would be here
  };

  // Handle video on/off
  const handleToggleVideo = () => {
    setCallState(prev => ({...prev, isVideoEnabled: !prev.isVideoEnabled}));
    // Logic to enable/disable video would be here
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (callState.isConnected) {
        disconnectFromCall();
        stopTimers();
      }
    };
  }, [callState.isConnected, disconnectFromCall, stopTimers]);

  // Update login status when currentUser changes
  useEffect(() => {
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 overflow-hidden flex flex-col">
        <AgoraCallModalHeader 
          expert={expert}
          duration={formatTime(duration)}
          cost={cost}
          remainingTime={formatTime(remainingTime)}
          onClose={callState.isConnected ? endCall : () => onOpenChange(false)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isLoggedIn ? (
            <CallAuthMessage onClose={() => onOpenChange(false)} />
          ) : callError ? (
            <CallErrorMessage error={callError} onClose={() => onOpenChange(false)} />
          ) : !callState.isConnected ? (
            <AgoraCallInfo
              expert={expert}
              onCallTypeChange={setCallType}
              selectedCallType={callType}
              onStartCall={startCall}
              isConnecting={callState.isConnecting}
            />
          ) : (
            <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className={`flex-1 ${showChat ? 'hidden md:block md:w-2/3' : 'w-full'}`}>
                <AgoraCallContent
                  callState={callState}
                  expert={expert}
                  userName={userName || currentUser?.name || "You"}
                />
              </div>
              
              {showChat && (
                <div className="w-full md:w-1/3 border-l">
                  <AgoraCallChat
                    expertId={expertId?.toString() || ''}
                    userId={currentUser?.id || ''}
                    userName={currentUser?.name || ''}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        {callState.isConnected && (
          <AgoraCallControls
            isMuted={callState.isMuted}
            isVideoEnabled={callState.isVideoEnabled}
            onToggleMute={handleToggleMute}
            onToggleVideo={handleToggleVideo}
            onEndCall={endCall}
            onToggleChat={() => setShowChat(!showChat)}
            showChat={showChat}
            remainingSeconds={remainingTime}
            onExtendCall={() => extendCall(5)} // Extend by 5 minutes
            isExtending={isExtending}
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
