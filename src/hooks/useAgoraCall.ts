
import { useState, useEffect, useCallback } from 'react';
import { useCallTimer } from './useCallTimer';
import { useCallState, CallState } from '@/hooks/call/useCallState';
import { useCallOperations } from '@/hooks/call/useCallOperations';

interface UseAgoraCallProps {
  expertId: string;
  userId: string;
  callType?: 'audio' | 'video';
  onError?: (error: string) => void;
}

export const useAgoraCall = ({
  expertId,
  userId,
  callType: initialCallType = 'video',
  onError
}: UseAgoraCallProps) => {
  const [callType, setCallType] = useState<'audio' | 'video'>(initialCallType);
  const [callError, setCallError] = useState<string | null>(null);
  const { callState, setCallState } = useCallState();
  
  // Initialize the call timer (assuming expert price is in the context)
  const ratePerMinute = 1; // Default rate per minute
  
  const callTimer = useCallTimer(ratePerMinute);
  const { 
    duration, 
    cost, 
    remainingTime, 
    isExtending, 
    startTimers, 
    stopTimers, 
    extendCall, 
    calculateFinalCost, 
    formatTime 
  } = callTimer;
  
  // Initialize call operations
  const {
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo
  } = useCallOperations(
    expertId,
    setCallState,
    callState,
    startTimers,
    stopTimers,
    calculateFinalCost
  );

  // Handle errors
  useEffect(() => {
    if (callError && onError) {
      onError(callError);
    }
  }, [callError, onError]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (callState.isConnected) {
        endCall();
        stopTimers();
      }
    };
  }, [callState.isConnected, endCall, stopTimers]);

  return {
    callState,
    callType,
    duration,
    cost,
    remainingTime,
    isExtending,
    callError,
    startCall: async () => await startCall(callType),
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime
  };
};

export default useAgoraCall;
