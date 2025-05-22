
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
  const initializeCall = async (options?: { 
    expertId?: string; 
    expertName?: string; 
    chatMode?: boolean 
  }): Promise<any> => {
    console.log('Initializing Agora client - only when needed', options);
    
    try {
      const client = createClient();
      
      setCallState(prev => ({
        ...prev,
        client
      }));
      
      return Promise.resolve(client);
    } catch (error) {
      console.error('Error initializing Agora client:', error);
      return Promise.reject(error);
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
