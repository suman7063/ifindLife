import React, { useState, useEffect } from 'react';
import { useIncomingCallManager } from '@/hooks/useIncomingCallManager';
import IncomingCallModal from './IncomingCallModal';
import AgoraCallInterface from './AgoraCallInterface';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

const CallReceptionWidget: React.FC = () => {
  const {
    currentCall,
    isListening,
    acceptCall,
    declineCall,
    startListening,
    stopListening
  } = useIncomingCallManager();

  const { expert } = useSimpleAuth();
  const { getExpertPresence } = useExpertPresence();

  const [activeCall, setActiveCall] = useState<any>(null);

  // Log immediately when component renders
  console.log('📱 CallReceptionWidget rendering', {
    hasExpert: !!expert,
    expertAuthId: expert?.auth_id,
    expertId: expert?.id,
    isListening,
    currentCall: !!currentCall
  });

  // Log when component mounts and expert is available
  useEffect(() => {
    console.log('📱 CallReceptionWidget mounted', {
      hasExpert: !!expert,
      expertAuthId: expert?.auth_id,
      expertId: expert?.id,
      isListening
    });
  }, []);

  // Auto-start listening when expert becomes available
  useEffect(() => {
    if (!expert?.auth_id) {
      console.warn('📱 CallReceptionWidget: No expert auth_id yet, waiting...', {
        hasExpert: !!expert,
        expertId: expert?.id
      });
      return;
    }

    // Start listening if not already listening
    if (!isListening) {
      console.log('📱 CallReceptionWidget: Expert available, auto-starting call listening', {
        expertAuthId: expert.auth_id,
        expertId: expert.id
      });
      startListening();
    } else {
      console.log('📱 CallReceptionWidget: Already listening, skipping');
    }
  }, [expert?.auth_id, isListening, startListening]); // Run when expert auth_id becomes available

  // Auto-sync listening with expert availability status
  useEffect(() => {
    if (!expert?.auth_id) return;
    
    const presence = getExpertPresence(expert.auth_id);
    const shouldListen = presence?.isAvailable !== false; // Default to true if not explicitly false
    
    console.log('CallReceptionWidget: Syncing with master status', {
      expertAuthId: expert.auth_id,
      shouldListen,
      currentlyListening: isListening,
      presenceStatus: presence?.status,
      isAvailable: presence?.isAvailable
    });
    
    if (shouldListen && !isListening) {
      console.log('Starting call listening - master status says available');
      startListening();
    } else if (!shouldListen && isListening) {
      console.log('Stopping call listening - master status says unavailable');
      stopListening();
    }
  }, [expert?.auth_id, getExpertPresence, isListening, startListening, stopListening]);

  // Debug: Log when currentCall changes (triggers modal)
  useEffect(() => {
    if (currentCall) {
      console.log('📞 CallReceptionWidget: NEW incoming call - showing modal:', currentCall.id);
    }
  }, [currentCall]);

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


  // Removed manual toggle - call listening is now controlled by MasterStatusControl

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
      {/* Incoming Call Modal - Show when currentCall exists (only for NEW calls via real-time) */}
      {currentCall && (
        <IncomingCallModal
          call={currentCall}
          isOpen={true}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}
    </>
  );
};

export default CallReceptionWidget;