import React, { useState, useEffect } from 'react';
import { useIncomingCallManager } from '@/hooks/useIncomingCallManager';
import IncomingCallModal from './IncomingCallModal';
import PendingCallsList from './PendingCallsList';
import AgoraCallInterface from './AgoraCallInterface';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

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

  const { expert } = useSimpleAuth();
  const { getExpertPresence } = useExpertPresence();

  const [showPendingCalls, setShowPendingCalls] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null);

  // Auto-start listening when expert is available
  useEffect(() => {
    if (!expert?.auth_id) return;
    
    const presence = getExpertPresence(expert.auth_id);
    const isAvailable = presence?.isAvailable || false;
    
    console.log('CallReceptionWidget: Checking presence', {
      expertAuthId: expert.auth_id,
      presence,
      isAvailable,
      isListening
    });
    
    if (isAvailable && !isListening) {
      console.log('Starting call listening - expert is available');
      startListening();
    } else if (!isAvailable && isListening) {
      console.log('Stopping call listening - expert not available');
      stopListening();
    }
  }, [expert?.auth_id, getExpertPresence, isListening, startListening, stopListening]);

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
      {/* Call Status Indicator - Always visible when expert is authenticated */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white shadow-lg rounded-lg border p-3 max-w-xs">
          <div className="flex items-center gap-2">
            {isListening ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Available for Calls</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-sm font-medium">Unavailable for Calls</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isListening 
              ? "Ready to receive incoming calls" 
              : "Set status to Available to receive calls"
            }
          </p>
          {expert?.auth_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleListening}
              className="mt-2 w-full text-xs"
            >
              {isListening ? 'Go Offline' : 'Go Online'}
            </Button>
          )}
        </div>
      </div>

      {/* Show pending calls button */}
      {pendingCalls.length > 0 && (
        <div className="fixed top-4 right-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPendingCalls(true)}
            className="relative bg-white shadow-lg"
          >
            <Phone className="w-4 h-4 mr-1" />
            <span>{pendingCalls.length} pending call{pendingCalls.length > 1 ? 's' : ''}</span>
          </Button>
        </div>
      )}

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