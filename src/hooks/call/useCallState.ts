
import { useState, useEffect, useCallback } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { CallState, createClient } from '@/utils/agoraService';

export const useCallState = () => {
  const [callState, setCallState] = useState<CallState>({
    localAudioTrack: null,
    localVideoTrack: null,
    remoteUsers: [],
    client: null,
    isJoined: false,
    isMuted: false,
    isVideoEnabled: true
  });
  
  // Define handleUserPublished as a useCallback to maintain consistent function reference
  const handleUserPublished = useCallback(async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    if (!callState.client) return;
    
    console.log("Remote user published:", user.uid, mediaType);
    await callState.client.subscribe(user, mediaType);
    console.log("Subscribed to remote user:", user.uid, mediaType);
    
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: [...prevState.remoteUsers.filter(u => u.uid !== user.uid), user]
    }));
  }, [callState.client]);

  // Fix: Ensure handleUserUnpublished accepts both user and mediaType parameters
  const handleUserUnpublished = useCallback((user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    console.log("Remote user unpublished:", user.uid, mediaType);
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: prevState.remoteUsers.filter(u => u.uid !== user.uid)
    }));
  }, []);

  const handleUserLeft = useCallback((user: IAgoraRTCRemoteUser) => {
    console.log("Remote user left:", user.uid);
    setCallState(prevState => ({
      ...prevState,
      remoteUsers: prevState.remoteUsers.filter(u => u.uid !== user.uid)
    }));
  }, []);
  
  useEffect(() => {
    // Initialize client only once
    let client: IAgoraRTCClient | null = null;
    
    // Create client asynchronously to avoid blocking the main thread
    const initClient = async () => {
      client = createClient();
      console.log("Agora client initialized:", client);
      setCallState(prev => ({ ...prev, client }));
    };
    
    // Initialize in a non-blocking way
    initClient();

    return () => {
      // Cleanup will happen in the useEffect below
    };
  }, []);
  
  // Separate useEffect for event listeners to avoid stale callbacks
  useEffect(() => {
    const { client } = callState;
    if (!client) return;
    
    // Use the current version of the callback functions
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);
    
    client.on('error', (err) => {
      console.error("Agora client error:", err);
    });
    
    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
      client.off('error');
    };
  }, [callState.client, handleUserPublished, handleUserUnpublished, handleUserLeft]);

  return {
    callState,
    setCallState
  };
};
