import React, { useState } from 'react';
import { useIncomingCallManager } from '@/hooks/useIncomingCallManager';
import IncomingCallModal from './IncomingCallModal';
import CallStatusIndicator from './CallStatusIndicator';
import PendingCallsList from './PendingCallsList';
import AgoraCallInterface from './AgoraCallInterface';

const CallReceptionWidget: React.FC = () => {
  const {
    currentCall,
    pendingCalls,
    isListening,
    acceptCall,
    declineCall,
    startListening,
    stopListening
  } = useIncomingCallManager();

  const [showPendingCalls, setShowPendingCalls] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null);

  const handleAcceptCall = async () => {
    if (!currentCall) return;
    
    try {
      await acceptCall(currentCall.id);
      setActiveCall(currentCall);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const handleDeclineCall = async () => {
    if (!currentCall) return;
    
    try {
      await declineCall(currentCall.id);
    } catch (error) {
      console.error('Error declining call:', error);
    }
  };

  const handleAcceptPendingCall = async (callId: string) => {
    try {
      await acceptCall(callId);
      const call = pendingCalls.find(c => c.id === callId);
      if (call) {
        setActiveCall(call);
      }
      setShowPendingCalls(false);
    } catch (error) {
      console.error('Error accepting pending call:', error);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleCallEnd = () => {
    setActiveCall(null);
  };

  // If there's an active call, show the call interface
  if (activeCall) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
        <AgoraCallInterface
          callRequest={activeCall}
          onCallEnd={handleCallEnd}
        />
      </div>
    );
  }

  return (
    <>
      {/* Call Status Indicator */}
      <CallStatusIndicator
        isListening={isListening}
        pendingCallsCount={pendingCalls.length}
        hasActiveCall={!!activeCall}
        onToggleListening={handleToggleListening}
        onShowPendingCalls={() => setShowPendingCalls(true)}
      />

      {/* Incoming Call Modal */}
      <IncomingCallModal
        call={currentCall}
        isOpen={!!currentCall}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />

      {/* Pending Calls List */}
      <PendingCallsList
        calls={pendingCalls}
        isOpen={showPendingCalls}
        onClose={() => setShowPendingCalls(false)}
        onAcceptCall={handleAcceptPendingCall}
        onDeclineCall={declineCall}
      />
    </>
  );
};

export default CallReceptionWidget;