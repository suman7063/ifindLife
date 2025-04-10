
export interface CallState {
  localStream?: any;
  remoteStream?: any;
  channelName?: string;
  token?: string;
  uid?: number;
  isConnecting: boolean;
  isConnected: boolean;
  hasError: boolean;
  errorMessage?: string;
  isMuted?: boolean;
  isVideoEnabled?: boolean;
  isJoined?: boolean;
}

export type CallType = 'audio' | 'video';

export interface CallSettings {
  channelName: string;
  callType: CallType;
  token?: string;
}

export const calculateCallCost = (
  duration: number, 
  pricePerMinute: number, 
  freeMinutes: number = 15
): number => {
  // Convert duration from seconds to minutes
  const durationInMinutes = duration / 60;
  
  // If the duration is within free minutes, no cost
  if (durationInMinutes <= freeMinutes) {
    return 0;
  }
  
  // Calculate billable minutes (rounded to nearest minute)
  const billableMinutes = Math.ceil(durationInMinutes - freeMinutes);
  
  // Calculate cost
  const cost = billableMinutes * pricePerMinute;
  
  return parseFloat(cost.toFixed(2)); // Round to 2 decimal places
};

// Dummy implementation for the call functions
export const createClient = () => {
  return {};
};

export const joinCall = async (settings: CallSettings, client: any) => {
  return {
    localAudioTrack: {},
    localVideoTrack: settings.callType === 'video' ? {} : null
  };
};

export const leaveCall = async (client: any, localAudioTrack: any, localVideoTrack: any) => {
  return true;
};

export const toggleMute = (track: any, isMuted: boolean) => {
  return !isMuted;
};

export const toggleVideo = (track: any, isEnabled: boolean) => {
  return !isEnabled;
};
