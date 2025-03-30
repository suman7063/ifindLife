
import { useState, useEffect } from 'react';
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
  
  useEffect(() => {
    const client = createClient();
    console.log("Agora client initialized:", client);
    setCallState(prev => ({ ...prev, client }));

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

  return {
    callState,
    setCallState
  };
};
