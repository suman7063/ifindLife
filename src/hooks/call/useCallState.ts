
import { useState, useCallback } from 'react';
import { CallState } from '@/lib/agoraService';

export const useCallState = () => {
  const [callState, setCallState] = useState<CallState>({
    localStream: null,
    remoteStream: null,
    isConnecting: false,
    isConnected: false,
    hasError: false,
    isMuted: false,
    isVideoEnabled: true,
    isJoined: false
  });
  
  return {
    callState,
    setCallState
  };
};
