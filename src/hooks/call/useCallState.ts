
import { useState, useCallback } from 'react';
import { IAgoraRTCRemoteUser, IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';

export interface CallState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnecting: boolean;
  isConnected: boolean;
  hasError: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isJoined: boolean;
  localAudioTrack?: ILocalAudioTrack;
  localVideoTrack?: ILocalVideoTrack;
  remoteUsers?: IAgoraRTCRemoteUser[];
  client?: IAgoraRTCClient;
}

export const useCallState = () => {
  const [callState, setCallState] = useState<CallState>({
    localStream: null,
    remoteStream: null,
    isConnecting: false,
    isConnected: false,
    hasError: false,
    isMuted: false,
    isVideoEnabled: true,
    isJoined: false,
    remoteUsers: []
  });
  
  return {
    callState,
    setCallState
  };
};
