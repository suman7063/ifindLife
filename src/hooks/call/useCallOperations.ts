import { useState, useCallback } from 'react';
import { CallState, joinCall } from '@/utils/agoraService';
import { useAgoraConfig } from '@/components/call/config/AgoraConfig';
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
  
  const { config } = useAgoraConfig();

  const startCall = useCallback(async (type: 'audio' | 'video' = 'video') => {
    console.log(`Starting ${type} call with expert ID: ${expertId} using App ID: ${config.appId}`);
    setCallType(type);
    setCallError(null);

    try {
      if (!callState.client) {
        toast.error('Call client not initialized. Please try again.');
        return false;
      }

      if (!config.appId) {
        toast.error('Agora App ID not configured. Please check configuration.');
        return false;
      }

      // Generate channel name
      // Generate unique channel name (must be <= 64 bytes for Agora)
      const timestamp = Date.now();
      const shortExpertId = String(expertId).replace(/-/g, '').substring(0, 8);
      const channelName = `call_${shortExpertId}_${timestamp}`;

      // Join the call using the configured App ID
      const { localAudioTrack, localVideoTrack } = await joinCall({
        channelName,
        callType: type,
        appId: config.appId
      }, callState.client);

      toast.success(`${type} call connected successfully`);
      
      // Start call timer
      startTimers();
      
      // Update call state
      setCallState(prev => ({
        ...prev,
        isJoined: true,
        isVideoEnabled: type === 'video',
        localAudioTrack,
        localVideoTrack
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallError('Failed to start call. Please check your connection and try again.');
      toast.error('Failed to start call');
      return false;
    }
  }, [callState.client, expertId, setCallState, startTimers, config.appId]);

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
