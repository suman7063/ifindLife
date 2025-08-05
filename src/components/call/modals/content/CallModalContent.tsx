
import React from 'react';
import { useCallModal } from '../context/CallModalProvider';
import { useCallEndHandler } from '@/hooks/call/useCallEndHandler';
import { useCallExtensionHandler } from '@/hooks/call/useCallExtensionHandler';
import { useCallSessionHandler } from '@/hooks/call/useCallSessionHandler';
import EnhancedCallTypeSelector from '../../enhanced/EnhancedCallTypeSelector';
import AgoraCallContent from '../../AgoraCallContent';
import AgoraCallControls from '../../AgoraCallControls';
import CallAuthMessage from '../CallAuthMessage';
import CallErrorMessage from '../CallErrorMessage';
import EnhancedCallTimer from '../../timer/EnhancedCallTimer';

interface CallModalContentProps {
  expert: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  };
  onClose: () => void;
}

export const CallModalContent: React.FC<CallModalContentProps> = ({ expert, onClose }) => {
  const {
    callStatus,
    errorMessage,
    showChat,
    isAuthenticated,
    authLoading,
    userProfile,
    formatPrice,
    callState,
    timerData,
    callOperations,
    handleRetry,
    handleToggleChatPanel
  } = useCallModal();

  const { handleEndCall } = useCallEndHandler({ onClose });
  const { handleExtendCall } = useCallExtensionHandler();
  const { handleCallStarted } = useCallSessionHandler({ expert });

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
          duration={timerData.duration}
          selectedDurationMinutes={timerData.selectedDurationMinutes}
          extensionMinutes={timerData.extensionMinutes}
          remainingTime={timerData.remainingTime}
          isOvertime={timerData.isOvertime}
          isInWarningPeriod={timerData.isInWarningPeriod}
          onExtendCall={handleExtendCall}
          formatTime={timerData.formatTime}
          pricePerMinute={expert.price}
          walletBalance={userProfile?.wallet_balance || 0}
          formatPrice={formatPrice}
        />
      </div>

      <AgoraCallContent
        callState={callState}
        callStatus={callStatus}
        showChat={showChat}
        duration={timerData.duration}
        remainingTime={timerData.remainingTime}
        cost={timerData.calculateFinalCost()}
        formatTime={timerData.formatTime}
        expertPrice={expert.price}
        userName={userProfile?.name || 'You'}
        expertName={expert.name}
      />
      
      {callStatus === 'connected' && (
        <div className="flex justify-center mt-4">
          <AgoraCallControls
            callState={callState}
            callType={callOperations.callType}
            isExtending={false}
            isFullscreen={false}
            onToggleMute={callOperations.handleToggleMute}
            onToggleVideo={callOperations.handleToggleVideo}
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

export default CallModalContent;
