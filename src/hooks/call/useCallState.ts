
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

  // Make sure handleUserUnpublished correctly accepts two arguments as required by Agora SDK
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
    
    // The event handler for user-published takes two arguments: user and mediaType
    client.on('user-published', handleUserPublished);
    
    // The event handler for user-unpublished also takes two arguments: user and mediaType
    client.on('user-unpublished', handleUserUnpublished);
    
    // The event handler for user-left takes one argument: user
    client.on('user-left', handleUserLeft);
    
    client.on('error', (err) => {
      console.error("Agora client error:", err);
    });
    
    return () => {
      // Make sure to use the same reference to the handlers when removing them
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
