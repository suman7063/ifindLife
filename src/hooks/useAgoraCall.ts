
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
  CallType
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialSlot = 15 * 60; // 15 minutes in seconds

  // Initialize Agora client
  useEffect(() => {
    const client = createClient();
    setCallState(prev => ({ ...prev, client }));

    // Set up event listeners
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);

    return () => {
      // Clean up event listeners
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
    };
  }, []);

  // Handle user published event
  const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    if (!callState.client) return;
    
    // Subscribe to the remote user
    await callState.client.subscribe(user, mediaType);
    
    // Update remote users state
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: [...prevState.remoteUsers.filter(u => u.uid !== user.uid), user]
    }));
  };

  // Handle user unpublished event
  const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
    // Update remote users state
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: prevState.remoteUsers.filter(u => u.uid !== user.uid)
    }));
  };

  // Handle user left event
  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    // Update remote users state
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: prevState.remoteUsers.filter(u => u.uid !== user.uid)
    }));
  };

  // Start call timer
  const startTimers = () => {
    // Start duration timer
    durationTimerRef.current = setInterval(() => {
      setDuration(prev => {
        const newDuration = prev + 1;
        
        // Calculate cost after first 15 minutes
        if (newDuration > initialSlot) {
          const billableSeconds = newDuration - initialSlot;
          const billableMinutes = billableSeconds / 60;
          setCost(expertPrice * billableMinutes);
        }
        
        return newDuration;
      });
    }, 1000);

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        // When time is up, show extension option
        if (prev <= 1) {
          setIsExtending(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Join the call
  const startCall = async (selectedCallType: CallType = 'video') => {
    if (!callState.client || !currentUser) return;
    
    try {
      setCallType(selectedCallType);
      
      // Generate a channel name from user and expert IDs
      const channelName = `call_${currentUser.id}_${expertId}`;
      
      const callSettings: CallSettings = {
        channelName,
        callType: selectedCallType
      };
      
      // Join the channel and create local tracks
      const { localAudioTrack, localVideoTrack } = await joinCall(callSettings, callState.client);
      
      // Update state
      setCallState(prev => ({
        ...prev,
        localAudioTrack,
        localVideoTrack,
        isJoined: true,
        isMuted: false,
        isVideoEnabled: selectedCallType === 'video'
      }));
      
      // Start timers
      startTimers();
      
      return true;
    } catch (error) {
      console.error('Error joining call:', error);
      return false;
    }
  };

  // End the call
  const endCall = async () => {
    const { client, localAudioTrack, localVideoTrack } = callState;
    
    if (!client) return;
    
    try {
      // Leave the channel and clean up
      await leaveCall(client, localAudioTrack, localVideoTrack);
      
      // Clear timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      
      // Reset state
      setCallState(prev => ({
        ...prev,
        localAudioTrack: null,
        localVideoTrack: null,
        remoteUsers: [],
        isJoined: false,
        isMuted: false,
        isVideoEnabled: true
      }));
      
      // Calculate final cost
      const finalCost = calculateFinalCost();
      
      return { success: true, duration, cost: finalCost };
    } catch (error) {
      console.error('Error ending call:', error);
      return { success: false, duration, cost };
    }
  };

  // Toggle mute
  const handleToggleMute = () => {
    const { localAudioTrack, isMuted } = callState;
    
    if (!localAudioTrack) return;
    
    const newMuteState = toggleMute(localAudioTrack, isMuted);
    
    setCallState(prev => ({
      ...prev,
      isMuted: newMuteState
    }));
  };

  // Toggle video
  const handleToggleVideo = () => {
    const { localVideoTrack, isVideoEnabled } = callState;
    
    if (!localVideoTrack) return;
    
    const newVideoState = toggleVideo(localVideoTrack, isVideoEnabled);
    
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: newVideoState
    }));
  };

  // Extend call
  const extendCall = () => {
    // Add 15 more minutes
    setRemainingTime(prev => prev + 15 * 60);
    setIsExtending(false);
  };

  // Calculate final cost
  const calculateFinalCost = (): number => {
    // If duration is less than or equal to initial slot, cost is 0
    if (duration <= initialSlot) {
      return 0;
    }
    
    // Calculate billable time in minutes
    const billableSeconds = duration - initialSlot;
    const billableMinutes = billableSeconds / 60;
    
    // Calculate cost
    return expertPrice * billableMinutes;
  };

  // Format time (HH:MM:SS)
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
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime
  };
};
