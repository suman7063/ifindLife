
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
  console.log("Creating Agora client");
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
  // For testing purposes, we return a placeholder that should work with the Agora test mode
  console.log(`Generating token for channel: ${channelName}, uid: ${uid}`);
  return '';  // Empty token works in test/dev mode with app security off
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
  console.log(`Joining channel: ${channelName} with uid: ${generatedUid}`);
  
  try {
    // Join the channel - in testing mode with security disabled, we can use null as token
    // In production, use a proper token
    await client.join(appId, channelName, token || null, generatedUid);
    console.log("Successfully joined channel");

    // Create local audio track
    console.log("Creating microphone audio track");
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack().catch(err => {
      console.error("Error creating audio track:", err);
      return null;
    });
    
    // Create local video track if video call
    let localVideoTrack: ICameraVideoTrack | null = null;
    if (callType === 'video') {
      console.log("Creating camera video track");
      localVideoTrack = await AgoraRTC.createCameraVideoTrack().catch(err => {
        console.error("Error creating video track:", err);
        return null;
      });
    }

    // Publish tracks
    const tracksToPublish = [];
    if (localAudioTrack) tracksToPublish.push(localAudioTrack);
    if (localVideoTrack) tracksToPublish.push(localVideoTrack);
    
    if (tracksToPublish.length > 0) {
      console.log(`Publishing ${tracksToPublish.length} tracks`);
      await client.publish(tracksToPublish);
      console.log("Tracks published successfully");
    }

    return { localAudioTrack, localVideoTrack };
  } catch (error) {
    console.error("Error in joinCall:", error);
    throw error;
  }
};

// Leave the call and clean up resources
export const leaveCall = async (
  client: IAgoraRTCClient,
  localAudioTrack: IMicrophoneAudioTrack | null,
  localVideoTrack: ICameraVideoTrack | null
): Promise<void> => {
  console.log("Leaving call, cleaning up resources");
  
  // Unpublish and close local tracks
  if (localAudioTrack) {
    try {
      await client.unpublish(localAudioTrack);
      localAudioTrack.close();
      console.log("Audio track unpublished and closed");
    } catch (err) {
      console.error("Error unpublishing audio track:", err);
    }
  }
  
  if (localVideoTrack) {
    try {
      await client.unpublish(localVideoTrack);
      localVideoTrack.close();
      console.log("Video track unpublished and closed");
    } catch (err) {
      console.error("Error unpublishing video track:", err);
    }
  }

  // Leave the channel
  try {
    await client.leave();
    console.log("Successfully left channel");
  } catch (err) {
    console.error("Error leaving channel:", err);
  }
};

// Toggle mute for audio
export const toggleMute = (audioTrack: IMicrophoneAudioTrack, isMuted: boolean): boolean => {
  if (isMuted) {
    audioTrack.setEnabled(true);
    console.log("Microphone unmuted");
    return false;
  } else {
    audioTrack.setEnabled(false);
    console.log("Microphone muted");
    return true;
  }
};

// Toggle video
export const toggleVideo = (videoTrack: ICameraVideoTrack | null, isEnabled: boolean): boolean => {
  if (!videoTrack) return false;
  
  if (isEnabled) {
    videoTrack.setEnabled(false);
    console.log("Camera disabled");
    return false;
  } else {
    videoTrack.setEnabled(true);
    console.log("Camera enabled");
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
