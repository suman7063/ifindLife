
import { useCallState } from './call/useCallState';
import { useCallTimer } from './call/useCallTimer';
import { useCallOperations } from './call/useCallOperations';

export const useAgoraCall = (expertId: number, expertPrice: number) => {
  const { callState, setCallState } = useCallState();
  
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
  } = useCallTimer(expertPrice);
  
  const {
    callType,
    callError,
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
