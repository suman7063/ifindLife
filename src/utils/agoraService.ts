
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

// Agora credentials
const appId = 'eaa6ef921d794c929b60fe8d9f7df7d6';
const appCertificate = 'c2f1548b28a9468c81374e8857c265f9';

// Define call types
export type CallType = 'audio' | 'video';

export interface CallSettings {
  channelName: string;
  token?: string;
  uid?: number;
  callType: CallType;
}

export interface CallState {
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  client: IAgoraRTCClient | null;
  isJoined: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

// Initialize Agora client with mode and codec
export const createClient = () => {
  return AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
};

// Generate a random UID for the user
export const generateUid = (): number => {
  return Math.floor(Math.random() * 1000000);
};

// Generate a temporary token (in a real app, this should be done on the server side)
// This is a placeholder - in production, use a server endpoint to generate tokens
export const generateToken = (channelName: string, uid: number): string => {
  // In a real implementation, this would call your backend to generate a token
  // For now, we return a placeholder
  return `placeholder-token-${channelName}-${uid}`;
};

// Create and join a call
export const joinCall = async (
  callSettings: CallSettings,
  client: IAgoraRTCClient
): Promise<{
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
}> => {
  const { channelName, token, uid, callType } = callSettings;
  const generatedUid = uid || generateUid();
  const generatedToken = token || generateToken(channelName, generatedUid);

  // Join the channel
  await client.join(appId, channelName, generatedToken, generatedUid);

  // Create local audio track
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  
  // Create local video track if video call
  let localVideoTrack: ICameraVideoTrack | null = null;
  if (callType === 'video') {
    localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  }

  // Publish tracks
  if (localVideoTrack) {
    await client.publish([localAudioTrack, localVideoTrack]);
  } else {
    await client.publish([localAudioTrack]);
  }

  return { localAudioTrack, localVideoTrack };
};

// Leave the call and clean up resources
export const leaveCall = async (
  client: IAgoraRTCClient,
  localAudioTrack: IMicrophoneAudioTrack | null,
  localVideoTrack: ICameraVideoTrack | null
): Promise<void> => {
  // Unpublish and close local tracks
  if (localAudioTrack) {
    localAudioTrack.close();
  }
  if (localVideoTrack) {
    localVideoTrack.close();
  }

  // Leave the channel
  await client.leave();
};

// Toggle mute for audio
export const toggleMute = (audioTrack: IMicrophoneAudioTrack, isMuted: boolean): boolean => {
  if (isMuted) {
    audioTrack.setEnabled(true);
    return false;
  } else {
    audioTrack.setEnabled(false);
    return true;
  }
};

// Toggle video
export const toggleVideo = (videoTrack: ICameraVideoTrack | null, isEnabled: boolean): boolean => {
  if (!videoTrack) return false;
  
  if (isEnabled) {
    videoTrack.setEnabled(false);
    return false;
  } else {
    videoTrack.setEnabled(true);
    return true;
  }
};

// Calculate call cost based on duration and expert price
export const calculateCallCost = (
  durationInSeconds: number, 
  pricePerMinute: number, 
  initialFreeMinutes: number = 0
): number => {
  // Convert duration to minutes
  const durationInMinutes = durationInSeconds / 60;
  
  // Calculate billable minutes (subtract free minutes)
  const billableMinutes = Math.max(0, durationInMinutes - initialFreeMinutes);
  
  // Calculate cost
  return billableMinutes * pricePerMinute;
};
