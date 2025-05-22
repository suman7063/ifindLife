
import { useState } from 'react';
import { CallState, createClient } from '@/utils/agoraService';

// Initial empty state - no Agora SDK initialization here
const initialCallState: CallState = {
  localAudioTrack: null,
  localVideoTrack: null,
  remoteUsers: [],
  client: null,
  isJoined: false,
  isMuted: false,
  isVideoEnabled: true,
  isAudioEnabled: true
};

export const useCallState = () => {
  const [callState, setCallState] = useState<CallState>(initialCallState);
  
  // Only create the Agora client when explicitly called
  const initializeCall = () => {
    console.log('Initializing Agora client - only when needed');
    
    try {
      const client = createClient();
      
      setCallState(prev => ({
        ...prev,
        client
      }));
      
      return client;
    } catch (error) {
      console.error('Error initializing Agora client:', error);
      return null;
    }
  };
  
  // Clean up the call state
  const endCall = () => {
    setCallState(initialCallState);
  };
  
  return {
    callState,
    setCallState,
    initializeCall,
    endCall
  };
};
