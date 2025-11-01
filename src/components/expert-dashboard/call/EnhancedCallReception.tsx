import React, { useState, useEffect } from 'react';
import { useIncomingCallManager } from '@/hooks/useIncomingCallManager';
import EnhancedCallNotification from './EnhancedCallNotification';
import AgoraCallInterface from './AgoraCallInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Bell, BellOff, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { toast } from 'sonner';
import { useCallFlow } from '@/hooks/useCallFlow';

const EnhancedCallReception: React.FC = () => {
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
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [activeCall, setActiveCall] = useState<any>(null);

  // Simplified: Real-time subscription to incoming_call_requests in useIncomingCallManager handles everything
  // No separate notifications table needed

  const handleAcceptCall = async (callRequestId: string) => {
    try {
      const success = await acceptCall(callRequestId);
      
      if (success) {
        // Find the call request and set it as active
        const call = pendingCalls.find(c => c.id === callRequestId) || currentCall;
        if (call) {
          setActiveCall(call);
        }
      }
    } catch (error) {
      console.error('Error accepting call:', error);
      toast.error('Failed to accept call');
    }
  };

  const handleDeclineCall = async (callRequestId: string) => {
    try {
      await declineCall(callRequestId);
      // Call will be removed from pendingCalls automatically by useIncomingCallManager
    } catch (error) {
      console.error('Error declining call:', error);
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

      {/* Current Incoming Call Notification */}
      {currentCall && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <EnhancedCallNotification
            callRequest={currentCall}
            onAccept={handleAcceptCall}
            onDecline={handleDeclineCall}
            onDismiss={() => {
              // Auto-dismiss after timeout
            }}
          />
        </div>
      )}

    </>
  );
};

export default EnhancedCallReception;

