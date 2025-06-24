
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useAgoraCall } from '@/hooks/useAgoraCall';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import AgoraCallTypeSelector from '../AgoraCallTypeSelector';
import CallAuthMessage from './CallAuthMessage';
import CallErrorMessage from './CallErrorMessage';
import ExtensionConfirmationModal from '../extension/ExtensionConfirmationModal';

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
  const { isAuthenticated, userProfile } = useAuth();
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [showChat, setShowChat] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);

  const {
    callState,
    duration,
    cost,
    remainingTime,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime
  } = useAgoraCall();

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

  const handleStartCall = async (selectedDuration: number) => {
    try {
      console.log('🔒 Starting call, current auth state:', { isAuthenticated, userProfile: !!userProfile });
      
      // Store auth state before call initialization
      const authBackup = {
        isAuthenticated,
        userProfile,
        sessionType: localStorage.getItem('sessionType')
      };
      
      setCallStatus('connecting');
      const success = await startCall(expert.id.toString(), callType);
      
      if (success) {
        setCallStatus('connected');
        console.log('🔒 Call started successfully, auth state preserved');
      } else {
        setCallStatus('error');
        console.error('🔒 Call failed to start');
      }
      
      // Verify auth state wasn't affected
      if (authBackup.isAuthenticated && !isAuthenticated) {
        console.error('🔒 CRITICAL: Auth state lost during call initialization!');
        // Could implement recovery here if needed
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

  const handleExtendCall = async () => {
    setShowExtensionModal(true);
  };

  const handleConfirmExtension = async (extensionMinutes: number, cost: number): Promise<boolean> => {
    try {
      setIsExtending(true);
      const success = await extendCall(extensionMinutes);
      setShowExtensionModal(false);
      return success;
    } catch (error) {
      console.error('Error extending call:', error);
      return false;
    } finally {
      setIsExtending(false);
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
            <AgoraCallTypeSelector
              callType={callType}
              onCallTypeChange={setCallType}
              expert={expert}
              expertPrice={expert.price}
              onStartCall={handleStartCall}
            />
          )}

          {(callStatus === 'connecting' || callStatus === 'connected') && (
            <div className="space-y-4">
              <AgoraCallContent
                callState={callState}
                callStatus={callStatus}
                showChat={showChat}
                duration={duration}
                remainingTime={remainingTime}
                cost={cost}
                formatTime={formatTime}
                expertPrice={expert.price}
                userName={userProfile?.name || 'User'}
                expertName={expert.name}
              />
              
              {callStatus === 'connected' && (
                <AgoraCallControls
                  callState={callState}
                  callType={callType === 'video' ? 'video' : 'audio'}
                  onToggleMute={handleToggleMute}
                  onToggleVideo={handleToggleVideo}
                  onEndCall={handleEndCall}
                  onToggleChat={() => setShowChat(!showChat)}
                  onExtendCall={handleExtendCall}
                  showChat={showChat}
                  isExtending={isExtending}
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

      <ExtensionConfirmationModal
        isOpen={showExtensionModal}
        onClose={() => setShowExtensionModal(false)}
        onConfirm={handleConfirmExtension}
        expertPrice={expert.price}
        isExtending={isExtending}
      />
    </>
  );
};

export default EnhancedAgoraCallModal;
