
import { useState, useCallback } from 'react';
import { CallState } from '@/utils/agoraService';
import { toast } from 'sonner';

export const useCallOperations = (
  expertId: number,
  setCallState: React.Dispatch<React.SetStateAction<CallState>>,
  callState: CallState,
  startTimers: () => void,
  stopTimers: () => void,
  calculateFinalCost: () => number
) => {
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [callError, setCallError] = useState<string | null>(null);
  const [hasVideoPermission, setHasVideoPermission] = useState(true);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(true);

  const startCall = useCallback(async (type: 'audio' | 'video' = 'video') => {
    console.log(`Starting ${type} call with expert ID: ${expertId}`);
    setCallType(type);
    setCallError(null);

    try {
      if (!callState.client) {
        toast.error('Call client not initialized. Please try again.');
        return false;
      }

      // In a real implementation, you would connect to the Agora channel here
      // For this example, we'll just simulate a successful connection
      toast.success(`${type} call started`);
      
      // Start call timer
      startTimers();
      
      // Set join status
      setCallState(prev => ({
        ...prev,
        isJoined: true,
        isVideoEnabled: type === 'video'
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallError('Failed to start call. Please check your connection and try again.');
      toast.error('Failed to start call');
      return false;
    }
  }, [callState.client, expertId, setCallState, startTimers]);

  const endCall = useCallback(async () => {
    try {
      // Stop timers first to capture final duration/cost
      stopTimers();
      
      // Calculate final cost
      const finalCost = calculateFinalCost();
      
      // In a real implementation, you would disconnect from the Agora channel here
      console.log('Ending call, final cost:', finalCost);
      
      // Reset call state
      setCallState(prev => ({
        ...prev,
        isJoined: false,
        localAudioTrack: null,
        localVideoTrack: null,
        remoteUsers: []
      }));
      
      return {
        success: true,
        cost: finalCost
      };
    } catch (error) {
      console.error('Error ending call:', error);
      return {
        success: false,
        error: 'Failed to end call properly'
      };
    }
  }, [calculateFinalCost, setCallState, stopTimers]);

  const handleToggleMute = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
      isAudioEnabled: prev.isMuted // Toggle audio enabled based on previous mute state
    }));
  }, [setCallState]);

  const handleToggleVideo = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled
    }));
  }, [setCallState]);

  return {
    callType,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    hasVideoPermission,
    hasMicrophonePermission
  };
};
