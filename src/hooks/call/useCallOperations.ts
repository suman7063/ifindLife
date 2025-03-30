import { useState, useCallback } from 'react';
import { 
  CallSettings, 
  CallType,
  joinCall, 
  leaveCall, 
  toggleMute, 
  toggleVideo
} from '@/utils/agoraService';
import { useUserAuth } from '@/hooks/useUserAuth';

export const useCallOperations = (
  expertId: number, 
  setCallState: Function,
  callState: any,
  startTimers: Function,
  stopTimers: Function,
  calculateFinalCost: Function
) => {
  const { currentUser } = useUserAuth();
  const [callType, setCallType] = useState<CallType>('video');
  const [callError, setCallError] = useState<string | null>(null);

  const startCall = useCallback(async (selectedCallType: CallType = 'video') => {
    setCallError(null);
    
    if (!callState.client) {
      console.error("No Agora client available");
      setCallError("Call initialization failed: No client available");
      return false;
    }
    
    const userId = currentUser?.id || `guest-${Date.now()}`;
    console.log("Starting call with user:", userId, "expertId:", expertId);
    
    try {
      setCallType(selectedCallType);
      
      const channelName = `call_${userId}_${expertId}`;
      console.log("Channel name:", channelName);
      
      const callSettings: CallSettings = {
        channelName,
        callType: selectedCallType
      };
      
      console.log("Joining call with settings:", callSettings);
      
      const { localAudioTrack, localVideoTrack } = await joinCall(callSettings, callState.client);
      console.log("Join call success, tracks created:", 
        "audio:", !!localAudioTrack, 
        "video:", !!localVideoTrack
      );
      
      setCallState(prev => ({
        ...prev,
        localAudioTrack,
        localVideoTrack,
        isJoined: true,
        isMuted: false,
        isVideoEnabled: selectedCallType === 'video'
      }));
      
      startTimers();
      
      return true;
    } catch (error) {
      console.error('Error joining call:', error);
      setCallError(`Failed to join call: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }, [callState.client, currentUser, expertId, setCallState, startTimers]);

  const endCall = useCallback(async () => {
    const { client, localAudioTrack, localVideoTrack } = callState;
    
    if (!client) {
      console.error("No client available to end call");
      return { success: false, duration: 0, cost: 0 };
    }
    
    try {
      console.log("Ending call, cleaning up resources");
      await leaveCall(client, localAudioTrack, localVideoTrack);
      
      stopTimers();
      
      setCallState(prev => ({
        ...prev,
        localAudioTrack: null,
        localVideoTrack: null,
        remoteUsers: [],
        isJoined: false,
        isMuted: false,
        isVideoEnabled: true
      }));
      
      const finalCost = calculateFinalCost();
      
      return { success: true, duration: 0, cost: finalCost };
    } catch (error) {
      console.error('Error ending call:', error);
      return { success: false, duration: 0, cost: 0 };
    }
  }, [callState, setCallState, stopTimers, calculateFinalCost]);

  const handleToggleMute = useCallback(() => {
    const { localAudioTrack, isMuted } = callState;
    
    if (!localAudioTrack) return;
    
    const newMuteState = toggleMute(localAudioTrack, isMuted);
    
    setCallState(prev => ({
      ...prev,
      isMuted: newMuteState
    }));
  }, [callState, setCallState]);

  const handleToggleVideo = useCallback(() => {
    const { localVideoTrack, isVideoEnabled } = callState;
    
    if (!localVideoTrack) return;
    
    const newVideoState = toggleVideo(localVideoTrack, isVideoEnabled);
    
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: newVideoState
    }));
  }, [callState, setCallState]);

  return {
    callType,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo
  };
};
