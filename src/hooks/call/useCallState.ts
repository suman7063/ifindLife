
import { useState } from 'react';

export interface CallState {
  isConnecting: boolean;
  isConnected: boolean;
  hasJoined: boolean;
  hasError: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  localAudioTrack: any;
  localVideoTrack: any;
  remoteAudioTrack: any;
  remoteVideoTrack: any;
}

export const useCallState = () => {
  const [callState, setCallState] = useState<CallState>({
    isConnecting: false,
    isConnected: false,
    hasJoined: false,
    hasError: false,
    isMuted: false,
    isVideoEnabled: true,
    localAudioTrack: null,
    localVideoTrack: null,
    remoteAudioTrack: null,
    remoteVideoTrack: null,
  });

  return {
    callState,
    setCallState
  };
};
