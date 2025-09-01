import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { CallState, CallType, CallDuration, Expert } from '../CallInterface';
import { useRazorpayPayment } from '@/hooks/useRazorpayPayment';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface SessionData {
  startTime: Date;
  duration: number;
  cost: number;
}

export const useCallInterface = (expert: Expert) => {
  const [callState, setCallState] = useState<CallState>('selecting');
  const [callType, setCallType] = useState<CallType | null>(null);
  const [duration, setDuration] = useState<CallDuration | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { processPayment, isLoading: isPaymentLoading } = useRazorpayPayment();
  const { user, isAuthenticated } = useSimpleAuth();

  const handleStartCall = useCallback(async (
    selectedType: CallType, 
    selectedDuration: CallDuration
  ) => {
    try {
      // Check authentication first
      if (!isAuthenticated || !user) {
        setError('User not authenticated');
        setCallState('error');
        return;
      }

      setCallType(selectedType);
      setDuration(selectedDuration);
      setCallState('connecting');

      const cost = selectedDuration * expert.pricePerMinute;

      // Simulate connection delay, then start call directly (payment removed)
      setTimeout(() => {
        const session: SessionData = {
          startTime: new Date(),
          duration: 0, // Will be updated during call
          cost: cost
        };
        
        setSessionData(session);
        setCallState('connected');
        
        toast.success(`${selectedType} call started successfully!`);
      }, 1500); // 1.5 second delay to simulate connection

    } catch (err: any) {
      console.error('Failed to start call:', err);
      setError(err.message || 'Failed to start call');
      setCallState('error');
    }
  }, [expert, isAuthenticated, user]);

  const handleEndCall = useCallback(() => {
    if (sessionData) {
      const endTime = new Date();
      const actualDuration = Math.floor((endTime.getTime() - sessionData.startTime.getTime()) / 1000);
      
      setSessionData(prev => prev ? { ...prev, duration: actualDuration } : null);
    }
    
    setCallState('ended');
    toast.success('Call ended successfully');
  }, [sessionData]);

  const retryCall = useCallback(() => {
    setError(null);
    setCallState('selecting');
    setCallType(null);
    setDuration(null);
    setSessionData(null);
  }, []);

  return {
    callState,
    callType,
    duration,
    sessionData,
    error,
    isPaymentLoading,
    isAuthenticated,
    handleStartCall,
    handleEndCall,
    retryCall
  };
};