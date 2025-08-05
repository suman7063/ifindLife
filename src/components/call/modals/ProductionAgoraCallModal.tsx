
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import AgoraCallTypeSelector from '../AgoraCallTypeSelector';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import AgoraCallModalHeader from './AgoraCallModalHeader';
import CallAuthMessage from './CallAuthMessage';
import CallErrorMessage from './CallErrorMessage';
import { CallQualityIndicator, useCallQuality } from '../quality/CallQualityIndicator';
import { CallRecordingControls, useCallRecording } from '../recording/CallRecordingControls';
import { CallAnalytics, useCallAnalytics } from '../analytics/CallAnalytics';
import { CallSecurity, useCallSecurity } from '../security/CallSecurity';
import { useCallSession } from '../session/CallSessionManager';
import { useCallTimer } from '@/hooks/call/useCallTimer';
import { useCallOperations } from '@/hooks/call/useCallOperations';
import { useCallState } from '@/hooks/call/useCallState';

interface ProductionAgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const ProductionAgoraCallModal: React.FC<ProductionAgoraCallModalProps> = ({
  isOpen,
  onClose,
  expert,
}) => {
  const { isAuthenticated, isLoading: authLoading, userProfile } = useAuth();
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Production-ready hooks
  const { quality, networkStats } = useCallQuality();
  const { 
    isRecording, 
    recordingDuration, 
    startRecording, 
    stopRecording, 
    downloadRecording, 
    shareRecording 
  } = useCallRecording();
  const { analyticsData, updateAnalytics, resetAnalytics } = useCallAnalytics();
  const { 
    isSecureConnection,
    encryptionEnabled, 
    recordingConsent, 
    toggleRecordingConsent 
  } = useCallSecurity();
  
  // Session management
  const { 
    currentSession, 
    createSession, 
    endSession 
  } = useCallSession();
  
  // Existing hooks
  const { callState, setCallState, initializeCall, endCall } = useCallState();
  const {
    duration,
    cost,
    remainingTime: remainingFreeTime,
    formatTime,
    startTimers,
    stopTimers,
    calculateFinalCost
  } = useCallTimer(expert.price);

  const {
    callType,
    callError,
    startCall,
    endCall: finishCall,
    handleToggleMute,
    handleToggleVideo
  } = useCallOperations(
    expert.id,
    setCallState,
    callState,
    startTimers,
    stopTimers,
    calculateFinalCost
  );

  // Update analytics in real-time
  useEffect(() => {
    if (callStatus === 'connected') {
      updateAnalytics({
        duration,
        participants: callState.remoteUsers.length + 1,
        averageQuality: quality,
        networkIssues: networkStats.packetLoss > 3 ? 1 : 0
      });
    }
  }, [duration, callState.remoteUsers.length, quality, networkStats, callStatus, updateAnalytics]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCallStatus('choosing');
        setErrorMessage(null);
        setShowChat(false);
        setShowAnalytics(false);
        resetAnalytics();
        endCall();
      }, 300);
    }
  }, [isOpen, resetAnalytics, endCall]);

  // Initialize call with session management
  const handleStartCall = async (selectedType: 'audio' | 'video') => {
    try {
      setCallStatus('connecting');
      
      // Create call session
      const session = await createSession(
        expert.id,
        selectedType,
        userProfile?.id || ''
      );

      if (!session) {
        throw new Error('Failed to create call session');
      }

      // Initialize the call infrastructure
      await initializeCall({
        expertId: expert.id.toString(),
        expertName: expert.name,
        chatMode: false
      });
      
      // Start the call
      const success = await startCall(selectedType);
      
      if (success) {
        setCallStatus('connected');
        toast.success(`${selectedType} call connected successfully`);
      } else {
        throw new Error('Failed to connect call');
      }
      
    } catch (error: any) {
      console.error('Failed to start call:', error);
      setErrorMessage('Failed to initialize call session. Please try again.');
      setCallStatus('error');
    }
  };

  // Enhanced end call with session management and analytics
  const handleEndCall = async () => {
    try {
      if (isRecording) {
        await stopRecording();
      }

      const result = await finishCall();
      
      if (result.success && currentSession) {
        await endSession(currentSession.id, duration, result.cost || 0);
        
        setCallStatus('ended');
        toast.success(`Call ended. Duration: ${formatTime(duration)}${result.cost > 0 ? `, Cost: ₹${result.cost.toFixed(2)}` : ''}`);
        
        // Show analytics for a moment before closing
        setShowAnalytics(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setErrorMessage('Failed to end call properly. Please refresh the page.');
        setCallStatus('error');
      }
      
    } catch (error) {
      console.error('Error ending call:', error);
      setErrorMessage('Failed to end call properly. Please refresh the page.');
      setCallStatus('error');
    }
  };

  const handleRetry = () => {
    setCallStatus('choosing');
    setErrorMessage(null);
  };

  const handleToggleChatPanel = () => {
    setShowChat(!showChat);
  };

  // Enhanced modal content with production features
  const renderModalContent = () => {
    if (!isAuthenticated && !authLoading) {
      return <CallAuthMessage expertName={expert.name} onClose={onClose} />;
    }

    if (callStatus === 'error') {
      return <CallErrorMessage 
        errorMessage={errorMessage || 'An error occurred'} 
        onRetry={handleRetry} 
      />;
    }

    if (callStatus === 'choosing') {
      return (
        <AgoraCallTypeSelector 
          expert={expert} 
          onSelectCallType={handleStartCall} 
        />
      );
    }

    if (callStatus === 'ended' && showAnalytics) {
      return (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Call Completed</h3>
            <p className="text-gray-600">Thank you for using our service!</p>
          </div>
          <CallAnalytics data={analyticsData} />
        </div>
      );
    }

    return (
      <>
        {/* Quality, Recording, and Security indicators */}
        <div className="flex justify-between items-start mb-4 space-x-4">
          <div className="flex space-x-2">
            <CallQualityIndicator quality={quality} />
            <CallRecordingControls
              isRecording={isRecording}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onDownload={downloadRecording}
              onShare={shareRecording}
              recordingDuration={recordingDuration}
            />
          </div>
          <CallSecurity
            isSecureConnection={isSecureConnection}
            encryptionEnabled={encryptionEnabled}
            recordingConsent={recordingConsent}
            onToggleRecordingConsent={toggleRecordingConsent}
            className="w-64"
          />
        </div>

        <AgoraCallContent
          callState={callState}
          callStatus={callStatus}
          showChat={showChat}
          duration={duration}
          remainingTime={remainingFreeTime}
          cost={cost}
          formatTime={formatTime}
          expertPrice={expert.price}
          userName={userProfile?.name || 'You'}
          expertName={expert.name}
        />
        
        {callStatus === 'connected' && (
          <div className="flex justify-center mt-4">
            <AgoraCallControls
              callState={callState}
              callType={callType}
              
              isFullscreen={false}
              onToggleMute={handleToggleMute}
              onToggleVideo={handleToggleVideo}
              onEndCall={handleEndCall}
              
              onToggleChat={handleToggleChatPanel}
              onToggleFullscreen={() => {}}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <div className="p-4">
          <AgoraCallModalHeader
            callStatus={callStatus}
            expertName={expert.name}
            currency="₹"
            expertPrice={expert.price}
          />
          
          <div className="my-4">
            {renderModalContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductionAgoraCallModal;
