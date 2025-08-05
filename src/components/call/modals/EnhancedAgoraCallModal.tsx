
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRealAgoraCall } from '@/hooks/useRealAgoraCall';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import AgoraCallTypeSelector from '../AgoraCallTypeSelector';
import SimpleCallTypeSelector from '@/components/chat/SimpleCallTypeSelector';
import CallAuthMessage from './CallAuthMessage';
import CallErrorMessage from './CallErrorMessage';


interface Expert {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

interface EnhancedAgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert;
}

const EnhancedAgoraCallModal: React.FC<EnhancedAgoraCallModalProps> = ({
  isOpen,
  onClose,
  expert
}) => {
  const { isAuthenticated, userProfile } = useSimpleAuth();
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [showChat, setShowChat] = useState(false);
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
  } = useRealAgoraCall(expert.id, expert.price);

  // CRITICAL: Protect authentication during video call
  useEffect(() => {
    if (isOpen) {
      console.log('🔒 Video call modal opened, protecting auth state');
      sessionStorage.setItem('videoCallActive', 'true');
    } else {
      console.log('🔒 Video call modal closed, releasing auth protection');
      sessionStorage.removeItem('videoCallActive');
    }

    return () => {
      sessionStorage.removeItem('videoCallActive');
    };
  }, [isOpen]);

  // Enhanced auth state monitoring
  useEffect(() => {
    console.log('🔒 EnhancedAgoraCallModal - Auth state:', {
      isAuthenticated,
      hasUserProfile: !!userProfile,
      modalOpen: isOpen,
      callStatus
    });
  }, [isAuthenticated, userProfile, isOpen, callStatus]);

  const handleStartCall = async (selectedDuration: number, selectedCallType: 'video' | 'voice') => {
    try {
      console.log('🔒 Starting call, current auth state:', { isAuthenticated, userProfile: !!userProfile });
      
      // Update call type from selector
      setCallType(selectedCallType);
      
      setCallStatus('connecting');
      const success = await startCall(selectedDuration, selectedCallType);
      
      if (success) {
        setCallStatus('connected');
        console.log('🔒 Call started successfully, auth state preserved');
      } else {
        setCallStatus('error');
        console.error('🔒 Call failed to start');
      }
    } catch (error) {
      console.error('🔒 Error starting call:', error);
      setCallStatus('error');
    }
  };

  const handleEndCall = async () => {
    try {
      console.log('🔒 Ending call, maintaining auth state');
      const result = await endCall();
      setCallStatus('ended');
      
      // Small delay before closing to show results
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('🔒 Error ending call:', error);
      setCallStatus('error');
    }
  };


  // Show auth message if not authenticated
  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <CallAuthMessage expertName={expert.name} onClose={onClose} />
        </DialogContent>
      </Dialog>
    );
  }

  // Show error message if there's a call error
  if (callStatus === 'error' && callError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <CallErrorMessage 
            errorMessage={callError} 
            onRetry={() => setCallStatus('choosing')} 
            onClose={onClose} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`${showChat && callStatus === 'connected' ? 'sm:max-w-6xl' : 'sm:max-w-4xl'} max-h-[90vh] overflow-auto`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {callStatus === 'choosing' && `Connect with ${expert.name}`}
              {callStatus === 'connecting' && `Connecting to ${expert.name}...`}
              {callStatus === 'connected' && `In call with ${expert.name}`}
              {callStatus === 'ended' && `Call Ended`}
            </DialogTitle>
          </DialogHeader>

          {callStatus === 'choosing' && (
            <SimpleCallTypeSelector
              expert={expert}
              onStartCall={handleStartCall}
            />
          )}

          {(callStatus === 'connecting' || callStatus === 'connected' || isConnecting) && (
            <div className="space-y-4">
              <AgoraCallContent
                callState={callState}
                callStatus={isConnecting ? 'connecting' : (callState?.isJoined ? 'connected' : callStatus)}
                showChat={showChat}
                duration={duration}
                remainingTime={remainingTime}
                cost={cost}
                formatTime={formatTime}
                expertPrice={expert.price}
                userName={userProfile?.name || 'User'}
                expertName={expert.name}
              />
              
              {(callState?.isJoined || callStatus === 'connected') && (
                <AgoraCallControls
                  callState={callState}
                  callType={callType === 'video' ? 'video' : 'audio'}
                  onToggleMute={handleToggleMute}
                  onToggleVideo={handleToggleVideo}
                  onEndCall={handleEndCall}
                  onToggleChat={() => setShowChat(!showChat)}
                  showChat={showChat}
                />
              )}
            </div>
          )}

          {callStatus === 'ended' && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Call Completed</h3>
              <p className="text-gray-600 mb-2">Duration: {formatTime(duration)}</p>
              <p className="text-gray-600">Total Cost: ${cost.toFixed(2)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
};

export default EnhancedAgoraCallModal;
