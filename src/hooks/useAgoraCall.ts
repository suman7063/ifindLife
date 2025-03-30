import { useState, useEffect, useRef } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { 
  CallSettings, 
  CallState,
  createClient, 
  joinCall, 
  leaveCall, 
  toggleMute, 
  toggleVideo,
  CallType,
  calculateCallCost
} from '@/utils/agoraService';
import { useUserAuth } from '@/hooks/useUserAuth';

export const useAgoraCall = (expertId: number, expertPrice: number) => {
  const { currentUser } = useUserAuth();
  const [callState, setCallState] = useState<CallState>({
    localAudioTrack: null,
    localVideoTrack: null,
    remoteUsers: [],
    client: null,
    isJoined: false,
    isMuted: false,
    isVideoEnabled: true
  });
  
  const [callType, setCallType] = useState<CallType>('video');
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const [remainingTime, setRemainingTime] = useState(15 * 60); // 15 minutes in seconds
  const [callError, setCallError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialSlot = 15 * 60; // 15 minutes in seconds
  const initialSlotMinutes = initialSlot / 60; // Convert to minutes for calculation

  useEffect(() => {
    const client = createClient();
    console.log("Agora client initialized:", client);
    setCallState(prev => ({ ...prev, client }));

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);
    
    client.on('error', (err) => {
      console.error("Agora client error:", err);
      setCallError(`Agora error: ${err.message || 'Unknown error'}`);
    });

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
      client.off('error');
    };
  }, []);

  const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    if (!callState.client) return;
    
    console.log("Remote user published:", user.uid, mediaType);
    await callState.client.subscribe(user, mediaType);
    console.log("Subscribed to remote user:", user.uid, mediaType);
    
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: [...prevState.remoteUsers.filter(u => u.uid !== user.uid), user]
    }));
  };

  const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
    console.log("Remote user unpublished:", user.uid);
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: prevState.remoteUsers.filter(u => u.uid !== user.uid)
    }));
  };

  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    console.log("Remote user left:", user.uid);
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: prevState.remoteUsers.filter(u => u.uid !== user.uid)
    }));
  };

  const startTimers = () => {
    durationTimerRef.current = setInterval(() => {
      setDuration(prev => {
        const newDuration = prev + 1;
        
        if (newDuration > initialSlot) {
          setCost(calculateCallCost(newDuration, expertPrice, initialSlotMinutes));
        }
        
        return newDuration;
      });
    }, 1000);

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setIsExtending(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startCall = async (selectedCallType: CallType = 'video') => {
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
  };

  const endCall = async () => {
    const { client, localAudioTrack, localVideoTrack } = callState;
    
    if (!client) {
      console.error("No client available to end call");
      return { success: false, duration, cost };
    }
    
    try {
      console.log("Ending call, cleaning up resources");
      await leaveCall(client, localAudioTrack, localVideoTrack);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      
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
      
      return { success: true, duration, cost: finalCost };
    } catch (error) {
      console.error('Error ending call:', error);
      return { success: false, duration, cost };
    }
  };

  const handleToggleMute = () => {
    const { localAudioTrack, isMuted } = callState;
    
    if (!localAudioTrack) return;
    
    const newMuteState = toggleMute(localAudioTrack, isMuted);
    
    setCallState(prev => ({
      ...prev,
      isMuted: newMuteState
    }));
  };

  const handleToggleVideo = () => {
    const { localVideoTrack, isVideoEnabled } = callState;
    
    if (!localVideoTrack) return;
    
    const newVideoState = toggleVideo(localVideoTrack, isVideoEnabled);
    
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: newVideoState
    }));
  };

  const extendCall = () => {
    setRemainingTime(prev => prev + 15 * 60);
    setIsExtending(false);
  };

  const calculateFinalCost = (): number => {
    if (duration <= initialSlot) {
      return 0;
    }
    
    return calculateCallCost(duration, expertPrice, initialSlotMinutes);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

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
