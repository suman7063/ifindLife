
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth/AuthContext';
import EnhancedCallTypeSelector from '../enhanced/EnhancedCallTypeSelector';
import AgoraCallContent from '../AgoraCallContent';
import AgoraCallControls from '../AgoraCallControls';
import AgoraCallModalHeader from './AgoraCallModalHeader';
import CallAuthMessage from './CallAuthMessage';
import CallErrorMessage from './CallErrorMessage';
import EnhancedCallTimer from '../timer/EnhancedCallTimer';
import { useEnhancedCallTimer } from '@/hooks/call/useEnhancedCallTimer';
import { useCallOperations } from '@/hooks/call/useCallOperations';
import { useCallState } from '@/hooks/call/useCallState';
import { useEnhancedCallSession } from '@/hooks/call/useEnhancedCallSession';
import { useCallPricing } from '@/hooks/call/useCallPricing';

interface EnhancedAgoraCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
}

const EnhancedAgoraCallModal: React.FC<EnhancedAgoraCallModalProps> = ({
  isOpen,
  onClose,
  expert,
}) => {
  const { isAuthenticated, isLoading: authLoading, userProfile } = useAuth();
  const [callStatus, setCallStatus] = useState<'choosing' | 'connecting' | 'connected' | 'ended' | 'error'>('choosing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { formatPrice } = useCallPricing();
  const { currentSession, endCallSession, processWalletPayment } = useEnhancedCallSession();
  const { callState, setCallState, initializeCall, endCall } = useCallState();
  
  const {
    duration,
    selectedDurationMinutes,
    extensionMinutes,
    remainingTime,
    isOvertime,
    isInWarningPeriod,
    formatTime,
    startTimers,
    stopTimers,
    calculateFinalCost,
    extendCall,
    setSelectedDurationMinutes,
    getTimerStatus
  } = useEnhancedCallTimer(expert.price);

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

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCallStatus('choosing');
        setErrorMessage(null);
        setShowChat(false);
        setCurrentSessionId(null);
        endCall();
      }, 300);
    }
  }, [isOpen, endCall]);

  const handleCallStarted = async (sessionId: string, callType: 'audio' | 'video') => {
    try {
      setCurrentSessionId(sessionId);
      setCallStatus('connecting');
      
      // Get session details to extract duration
      if (currentSession) {
        setSelectedDurationMinutes(currentSession.selected_duration);
      }

      // Initialize the call infrastructure
      await initializeCall({
        expertId: expert.id.toString(),
        expertName: expert.name,
        chatMode: false
      });
      
      // Start the actual call
      const success = await startCall(callType);
      
      if (success) {
        setCallStatus('connected');
        toast.success(`${callType} call connected successfully`);
      } else {
        throw new Error('Failed to connect call');
      }
      
    } catch (error: any) {
      console.error('Failed to start call:', error);
      setErrorMessage('Failed to initialize call. Please try again.');
      setCallStatus('error');
    }
  };

  const handleExtendCall = async (extensionMinutes: number, cost: number): Promise<boolean> => {
    try {
      const currency = userProfile?.currency as 'USD' | 'INR' || 'USD';
      
      // Process payment for extension
      const paymentSuccess = await processWalletPayment(cost, currency);
      
      if (paymentSuccess) {
        // Extend the call timer
        const extensionSuccess = await extendCall(extensionMinutes);
        
        if (extensionSuccess) {
          toast.success(`Call extended by ${extensionMinutes} minutes`);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Extension failed:', error);
      toast.error('Failed to extend call');
      return false;
    }
  };

  const handleEndCall = async () => {
    try {
      const result = await finishCall();
      
      if (result.success && currentSessionId) {
        await endCallSession(currentSessionId, duration, result.cost || 0);
        
        setCallStatus('ended');
        const timerStatus = getTimerStatus();
        const statusMessage = timerStatus === 'overtime' ? ' (overtime charges applied)' : '';
        
        toast.success(`Call ended. Duration: ${formatTime(duration)}${result.cost > 0 ? `, Cost: ${formatPrice(result.cost)}${statusMessage}` : ''}`);
        
        setTimeout(() => {
          onClose();
        }, 2000);
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
        <EnhancedCallTypeSelector 
          expert={expert} 
          onCallStarted={handleCallStarted}
        />
      );
    }

    if (callStatus === 'ended') {
      return (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Call Completed</h3>
          <p className="text-gray-600">Thank you for using our service!</p>
          <p className="text-sm text-gray-500 mt-2">This window will close automatically.</p>
        </div>
      );
    }

    return (
      <>
        {/* Enhanced Timer with Extension Support */}
        <div className="mb-4">
          <EnhancedCallTimer
            duration={duration}
            selectedDurationMinutes={selectedDurationMinutes}
            extensionMinutes={extensionMinutes}
            remainingTime={remainingTime}
            isOvertime={isOvertime}
            isInWarningPeriod={isInWarningPeriod}
            onExtendCall={handleExtendCall}
            formatTime={formatTime}
            pricePerMinute={expert.price}
            walletBalance={userProfile?.wallet_balance || 0}
            formatPrice={formatPrice}
          />
        </div>

        <AgoraCallContent
          callState={callState}
          callStatus={callStatus}
          showChat={showChat}
          duration={duration}
          remainingTime={remainingTime}
          cost={calculateFinalCost()}
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
              isExtending={false}
              isFullscreen={false}
              onToggleMute={handleToggleMute}
              onToggleVideo={handleToggleVideo}
              onEndCall={handleEndCall}
              onExtendCall={() => {}} // Extension handled by timer component
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
            currency={userProfile?.currency || '$'}
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

export default EnhancedAgoraCallModal;
