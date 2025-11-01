
import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ILocalAudioTrack, 
  ILocalVideoTrack,
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';
import { AGORA_CONFIG } from '@/utils/agoraConfig';

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
  appId?: string;
  token?: string | null;
  uid?: number;
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
  const { 
    channelName, 
    callType, 
    appId,
    token = null,
    uid
  } = settings;
  
  const resolvedAppId = appId || AGORA_CONFIG.APP_ID;
  
  // Validate App ID BEFORE attempting to join
  if (!resolvedAppId || resolvedAppId.trim() === '') {
    console.error('');
    console.error('🔴 ========================================');
    console.error('🔴 APP ID IS MISSING');
    console.error('🔴 ========================================');
    console.error('   VITE_AGORA_APP_ID is not set in .env file');
    console.error('   ');
    console.error('   SOLUTION:');
    console.error('   1. Open your .env file');
    console.error('   2. Add: VITE_AGORA_APP_ID=your_app_id_here');
    console.error('   3. Restart your development server');
    console.error('   4. Make sure the App ID is exactly 32 characters');
    console.error('   5. Verify the App ID exists in Agora Console: https://console.agora.io/');
    console.error('');
    throw new Error('App ID is required to join call. Set VITE_AGORA_APP_ID in .env file');
  }
  
  // Validate App ID format
  if (resolvedAppId.length !== 32) {
    console.error('');
    console.error('🔴 ========================================');
    console.error('🔴 INVALID APP ID FORMAT');
    console.error('🔴 ========================================');
    console.error('   Expected: 32 characters');
    console.error('   Got:', resolvedAppId.length, 'characters');
    console.error('   Value:', resolvedAppId.substring(0, 8) + '...');
    console.error('   This will cause "can not find appid" error');
    console.error('   ');
    console.error('   SOLUTION:');
    console.error('   1. Verify VITE_AGORA_APP_ID in .env file is exactly 32 characters');
    console.error('   2. Get your App ID from Agora Console: https://console.agora.io/');
    console.error('   3. Make sure there are no extra spaces or quotes in .env file');
    console.error('');
    throw new Error(`Invalid App ID format: expected 32 characters, got ${resolvedAppId.length}. Check VITE_AGORA_APP_ID in .env file`);
  }
  
  // Use provided UID or generate one
  const userId = uid || Math.floor(Math.random() * 1000000);
  
  // Handle token: if null/undefined/empty, pass null to SDK for tokenless mode
  // Agora SDK explicitly requires null (not undefined) for tokenless mode
  const tokenForJoin = token && token !== 'null' && token !== '' && token !== 'undefined' 
    ? token 
    : null;
  
  console.log('');
  console.log('🔍 ========================================');
  console.log('🔍 AGORA CALL JOIN ATTEMPT');
  console.log('🔍 ========================================');
  console.log('   App ID:', resolvedAppId);
  console.log('   App ID Length:', resolvedAppId.length, 'characters ✅');
  console.log('   Channel:', channelName);
  console.log('   UID:', userId);
  console.log('   Has Token:', !!tokenForJoin);
  console.log('   Token Type:', tokenForJoin === null ? 'null (tokenless mode)' : 'provided');
  console.log('   ');
  console.log('   ⚠️ If you get "can not find appid" error:');
  console.log('      - Verify this App ID exists in Agora Console');
  console.log('      - Go to: https://console.agora.io/ → Your Project → Check App ID matches');
  console.log('      - Make sure you\'re using the correct project\'s App ID');
  console.log('🔍 ========================================');
  console.log('');
  
  try {
    // Join the channel with consistent App ID
    // Pass null (not undefined) for tokenless mode as per Agora SDK requirement
    await client.join(resolvedAppId, channelName, tokenForJoin, userId);
    console.log('✅ Agora: Joined channel:', channelName, 'with App ID:', resolvedAppId, 'User ID:', userId);
    
    // Create local audio track with quality settings
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
      encoderConfig: {
        sampleRate: 48000,
        stereo: false,
        bitrate: 48
      }
    });
    console.log('✅ Agora: Created local audio track');
    
    // Create local video track if video call
    let localVideoTrack = null;
    if (callType === 'video') {
      localVideoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: {
          width: 640,
          height: 480,
          frameRate: 15,
          bitrateMin: 200,
          bitrateMax: 1000
        }
      });
      console.log('✅ Agora: Created local video track');
    }
    
    // Publish tracks
    const tracksToPublish = localVideoTrack 
      ? [localAudioTrack, localVideoTrack] 
      : [localAudioTrack];
      
    await client.publish(tracksToPublish);
    console.log('✅ Agora: Published local tracks:', tracksToPublish.length, 'tracks');
    
    return {
      localAudioTrack,
      localVideoTrack
    };
  } catch (error) {
    console.error('');
    console.error('❌ ========================================');
    console.error('❌ AGORA CALL JOIN FAILED');
    console.error('❌ ========================================');
    console.error('   Error:', error instanceof Error ? error.message : String(error));
    console.error('   App ID used:', resolvedAppId);
    console.error('');
    
    // Check for specific error types
    if (error instanceof Error) {
      const errorMsg = error.message;
      
      // App ID not found error
      if (errorMsg.includes('can not find appid')) {
        console.error('🔴 APP ID NOT FOUND ERROR:');
        console.error('   The App ID does not exist in your Agora Console account.');
        console.error('   ');
        console.error('   POSSIBLE CAUSES:');
        console.error('   1. App ID is incorrect or doesn\'t exist');
        console.error('   2. App ID belongs to a different Agora account');
        console.error('   3. Project was deleted or App ID was changed');
        console.error('   ');
        console.error('   SOLUTION:');
        console.error('   1. Go to https://console.agora.io/');
        console.error('   2. Sign in with the account that owns the App ID');
        console.error('   3. Go to Projects → Select your project');
        console.error('   4. Copy the App ID from the project overview');
        console.error('   5. Update VITE_AGORA_APP_ID in your .env file');
        console.error('   6. Restart your development server');
        console.error('   ');
        console.error('   Current App ID being used:', resolvedAppId);
        console.error('   Verify this matches your Agora Console App ID');
        
        // Also check if it might be a token issue
        if (errorMsg.includes('invalid vendor key')) {
          console.error('   ');
          console.error('   NOTE: "invalid vendor key" can also mean:');
          console.error('   - Your project requires tokens but none were provided');
          console.error('   - Token is invalid or expired');
          console.error('   ');
          console.error('   TOKEN OPTIONS:');
          console.error('   Option A: Enable tokenless mode in Agora Console:');
          console.error('      - Go to Config tab → Enable "No Certificate" → Save');
          console.error('   Option B: Use proper token authentication:');
          console.error('      - Set AGORA_APP_CERTIFICATE in Supabase Secrets');
          console.error('      - Deploy generate-agora-token edge function');
        }
      } else if (errorMsg.includes('CAN_NOT_GET_GATEWAY_SERVER')) {
        // Gateway error - could be App ID or token issue
        console.error('🔴 AGORA GATEWAY ERROR:');
        console.error('   This error usually means one of the following:');
        console.error('   1. App ID is incorrect or doesn\'t exist');
        console.error('   2. Your project requires tokens but tokenless mode is being used');
        console.error('   3. Invalid or expired token');
        console.error('   ');
        console.error('   Current App ID being used:', resolvedAppId);
        console.error('   ');
        console.error('   SOLUTION OPTIONS:');
        console.error('   ');
        console.error('   Option A: Fix App ID (if it\'s wrong):');
        console.error('      1. Go to https://console.agora.io/');
        console.error('      2. Verify your App ID in the project');
        console.error('      3. Update VITE_AGORA_APP_ID in .env file');
        console.error('      4. Restart development server');
        console.error('   ');
        console.error('   Option B: Enable tokenless mode:');
        console.error('      1. Go to Agora Console → Your Project');
        console.error('      2. Go to Config tab');
        console.error('      3. Enable "No Certificate" (tokenless mode)');
        console.error('      4. Save and wait 1-2 minutes');
        console.error('   ');
        console.error('   Option C: Use proper token authentication:');
        console.error('      1. Get App Certificate from Agora Console');
        console.error('      2. Set AGORA_APP_CERTIFICATE in Supabase Edge Functions secrets');
        console.error('      3. Deploy generate-agora-token edge function');
      }
    }
    
    console.error('❌ ========================================');
    console.error('');
    
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
