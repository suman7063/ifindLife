
import { useState, useEffect } from 'react';
import { useCallTimer } from './useCallTimer';
import { CallState } from '@/lib/agoraService';
import { useCallOperations } from '@/hooks/call/useCallOperations';
import { useCallState } from '@/hooks/call/useCallState';

export const useAgoraCall = (expertId: number, ratePerMinute: number) => {
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [callError, setCallError] = useState<string | null>(null);
  
  // Initialize the call timer with expert price
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
  } = useCallTimer(ratePerMinute);
  
  // Initialize call state management
  const { callState, setCallState } = useCallState();
  
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
  
  return {
    callState,
    callType,
    duration,
    cost,
    remainingTime,
    isExtending,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime
  };
};

export default useAgoraCall;
