
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ILocalAudioTrack, 
  ILocalVideoTrack,
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';

export type CallType = 'audio' | 'video';

export interface CallState {
  localAudioTrack: ILocalAudioTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  client: IAgoraRTCClient | null;
  isJoined: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export interface CallSettings {
  channelName: string;
  callType: CallType;
}

// Create Agora client
export const createClient = (): IAgoraRTCClient => {
  return AgoraRTC.createClient({ 
    mode: 'rtc',
    codec: 'vp8'
  });
};

// Join call and create local tracks
export const joinCall = async (
  settings: CallSettings,
  client: IAgoraRTCClient
): Promise<{
  localAudioTrack: IMicrophoneAudioTrack | null;
  localVideoTrack: ICameraVideoTrack | null;
}> => {
  const { channelName, callType } = settings;
  const appId = ''; // Your Agora App ID here
  const userId = `user-${Math.floor(Math.random() * 1000000)}`;
  
  // For demo purposes only - in production get this from server
  const token = null;
  
  try {
    // Join the channel
    await client.join(appId, channelName, token, userId);
    console.log('Joined channel:', channelName);
    
    // Create local audio track
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    console.log('Created local audio track');
    
    // Create local video track if video call
    let localVideoTrack = null;
    if (callType === 'video') {
      localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      console.log('Created local video track');
    }
    
    // Publish tracks
    if (callType === 'video') {
      await client.publish([localAudioTrack, localVideoTrack]);
    } else {
      await client.publish([localAudioTrack]);
    }
    console.log('Published local tracks');
    
    return {
      localAudioTrack,
      localVideoTrack
    };
  } catch (error) {
    console.error('Error joining call:', error);
    throw error;
  }
};

// Leave call and release resources
export const leaveCall = async (
  client: IAgoraRTCClient,
  localAudioTrack: ILocalAudioTrack | null,
  localVideoTrack: ILocalVideoTrack | null
): Promise<void> => {
  try {
    // Stop and close local tracks
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    
    // Leave the channel
    await client.leave();
    console.log('Left channel successfully');
  } catch (error) {
    console.error('Error leaving call:', error);
    throw error;
  }
};

// Toggle mute for audio track
export const toggleMute = (localAudioTrack: ILocalAudioTrack, isMuted: boolean): boolean => {
  if (isMuted) {
    localAudioTrack.setEnabled(true);
    return false;
  } else {
    localAudioTrack.setEnabled(false);
    return true;
  }
};

// Toggle video
export const toggleVideo = (localVideoTrack: ILocalVideoTrack, isEnabled: boolean): boolean => {
  if (isEnabled) {
    localVideoTrack.setEnabled(false);
    return false;
  } else {
    localVideoTrack.setEnabled(true);
    return true;
  }
};

// Calculate call cost - assume free for first X minutes, then charge per minute
export const calculateCallCost = (
  durationInSeconds: number, 
  pricePerMinute: number,
  freeMinutes: number = 15
): number => {
  const durationInMinutes = durationInSeconds / 60;
  
  if (durationInMinutes <= freeMinutes) {
    return 0;
  }
  
  const billableMinutes = Math.ceil(durationInMinutes - freeMinutes);
  return billableMinutes * pricePerMinute;
};
