/**
 * Agora Service
 * Handles Agora SDK integration for video/audio calls
 */

import AgoraRTC, { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ILocalAudioTrack, 
  ILocalVideoTrack,
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';
import { AGORA_CONFIG } from './agoraConfig';

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

/**
 * Create Agora client instance
 */
export const createClient = (): IAgoraRTCClient => {
  // Handle autoplay failure for video and audio
  AgoraRTC.onAutoplayFailed = () => {
    console.warn('⚠️ Autoplay failed - user interaction required for media playback');
    // The media will need to be played after user interaction
  };

  return AgoraRTC.createClient({ 
    mode: 'rtc',
    codec: 'vp8'
  });
};

/**
 * Join call and create local tracks
 */
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
  
  // Validate App ID
  if (!resolvedAppId || resolvedAppId.trim() === '') {
    const errorMsg = 'App ID is required to join call. Set VITE_AGORA_APP_ID in .env file';
    console.error('❌', errorMsg);
    console.error('📋 Current AGORA_CONFIG:', AGORA_CONFIG);
    throw new Error(errorMsg);
  }
  
  if (resolvedAppId.length !== 32) {
    const errorMsg = `Invalid App ID format: expected 32 characters, got ${resolvedAppId.length}. Check VITE_AGORA_APP_ID in .env file`;
    console.error('❌', errorMsg);
    console.error('📋 App ID value:', resolvedAppId.substring(0, 8) + '...');
    throw new Error(errorMsg);
  }
  
  const userId = uid || Math.floor(Math.random() * 1000000);
  
  // Handle token: if null/undefined/empty, pass null to SDK for tokenless mode
  // BUT: If App ID requires token-based auth, we need a valid token
  const tokenForJoin = token && token !== 'null' && token !== '' && token !== 'undefined' 
    ? token 
    : null;
  
  // Warn if token is missing but might be required
  if (!tokenForJoin) {
    console.warn('⚠️ No token provided - using tokenless mode. If your Agora App ID requires token-based auth, this may fail.');
  }
  
  console.log('🔍 Joining Agora call:', {
    appId: resolvedAppId.substring(0, 8) + '...' + resolvedAppId.substring(24), // Show first 8 and last 8 chars
    appIdLength: resolvedAppId.length,
    channelName,
    uid: userId,
    hasToken: !!tokenForJoin,
    tokenLength: tokenForJoin ? tokenForJoin.length : 0,
    callType
  });
  
  try {
    // Request microphone permission
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getTracks().forEach(track => track.stop());
      console.log('✅ Microphone permission granted');
    } catch (audioError) {
      const error = audioError as Error & { name?: string };
      if (error.name === 'NotFoundError') {
        throw new Error('No microphone found. Please connect a microphone.');
      } else if (error.name === 'NotAllowedError') {
        throw new Error('Microphone permission was denied. Please allow microphone access.');
      } else {
        throw new Error('Unable to access microphone. Please check your device settings.');
      }
    }
    
    // Join the channel
    try {
      console.log('🔗 Attempting to join Agora channel...', {
        appId: resolvedAppId.substring(0, 8) + '...' + resolvedAppId.substring(24),
        channelName,
        uid: userId,
        hasToken: !!tokenForJoin,
        tokenLength: tokenForJoin ? tokenForJoin.length : 0
      });
      
      await client.join(resolvedAppId, channelName, tokenForJoin, userId);
      console.log('✅ Agora: Successfully joined channel:', channelName, 'User ID:', userId);
    } catch (joinError: any) {
      console.error('❌ Agora join failed:', {
        error: joinError,
        message: joinError?.message,
        code: joinError?.code,
        name: joinError?.name,
        appId: resolvedAppId.substring(0, 8) + '...',
        appIdLength: resolvedAppId.length,
        channelName,
        hasToken: !!tokenForJoin,
        tokenLength: tokenForJoin ? tokenForJoin.length : 0,
        uid: userId
      });
      
      // Provide helpful error message based on error type
      // Check for various connection error patterns
      const errorMessage = joinError?.message || '';
      const errorCode = joinError?.code || '';
      const errorName = joinError?.name || '';
      
      // Check for "invalid token" or "authorized failed" errors (case insensitive)
      const errorMessageLower = errorMessage.toLowerCase();
      if (errorMessageLower.includes('invalid token') || 
          errorMessageLower.includes('authorized failed') ||
          errorMessageLower.includes('authorization failed') ||
          errorMessageLower.includes('token invalid') ||
          errorMessageLower.includes('token error')) {
        const errorMsg = 'Invalid Agora token. The token may be expired, incorrectly generated, or doesn\'t match the channel/user. Please ensure:\n1. Token is generated with correct AGORA_APP_CERTIFICATE\n2. Token is not expired (check expireTime parameter)\n3. Token matches the exact channel name and user ID\n4. Token role matches your usage (publisher/subscriber)\n5. AGORA_APP_CERTIFICATE is correctly set in Supabase Edge Function';
        console.error('❌', errorMsg);
        console.error('📋 Token details:', {
          hasToken: !!tokenForJoin,
          tokenLength: tokenForJoin ? tokenForJoin.length : 0,
          tokenPreview: tokenForJoin ? tokenForJoin.substring(0, 30) + '...' : 'null',
          channelName,
          uid: userId,
          appId: resolvedAppId.substring(0, 8) + '...'
        });
        throw new Error(errorMsg);
      }
      
      // Check for "dynamic use static key" error - App ID requires token but token is missing/invalid
      if (errorMessage.includes('dynamic use static key') || 
          (errorMessage.includes('CAN_NOT_GET_GATEWAY_SERVER') && errorMessage.includes('dynamic'))) {
        const errorMsg = 'Your Agora App ID requires token-based authentication, but no valid token was provided. Please ensure:\n1. Token is generated correctly using AGORA_APP_CERTIFICATE\n2. Token is not expired\n3. Token matches the channel name and user ID\n4. AGORA_APP_CERTIFICATE is set in your Supabase Edge Function environment';
        console.error('❌', errorMsg);
        console.error('📋 Token status:', {
          hasToken: !!tokenForJoin,
          tokenLength: tokenForJoin ? tokenForJoin.length : 0,
          tokenPreview: tokenForJoin ? tokenForJoin.substring(0, 20) + '...' : 'null'
        });
        throw new Error(errorMsg);
      }
      
      // Check for connection/gateway errors (but skip if it's a token error)
      if ((errorMessage.includes('CAN_NOT_GET_GATEWAY_SERVER') || 
          errorMessage.includes('gateway') ||
          errorMessage.includes('network') ||
          errorMessage.includes('connection') ||
          errorCode === 'CAN_NOT_GET_GATEWAY_SERVER' ||
          errorCode === 'INVALID_APP_ID' ||
          errorCode === 'INVALID_CHANNEL_NAME' ||
          errorName === 'NetworkError' ||
          errorName === 'ConnectionError') &&
          !errorMessageLower.includes('token') && 
          !errorMessageLower.includes('authorized') &&
          !errorMessageLower.includes('authorization')) {
        const errorMsg = 'Failed to connect to Agora servers. Please check:\n1. VITE_AGORA_APP_ID is set correctly in .env file (32 characters)\n2. Your internet connection is stable\n3. Agora App ID is valid and active\n4. Token is generated correctly (if App ID requires token-based auth)';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }
      
      // Check for token-related errors
      if (errorMessage.includes('token') || errorCode === 'INVALID_TOKEN' || errorCode === 'TOKEN_EXPIRED') {
        const errorMsg = 'Token authentication failed. Please check:\n1. Token is valid and not expired\n2. Token was generated with correct App ID and channel name\n3. Token role matches your usage (publisher/subscriber)';
        console.error('❌', errorMsg);
        throw new Error(errorMsg);
      }
      
      // Generic error - include original message if available
      const genericErrorMsg = errorMessage 
        ? `Failed to join Agora call: ${errorMessage}`
        : 'Failed to connect to Agora servers. Please check your internet connection and Agora configuration.';
      throw new Error(genericErrorMsg);
    }
    
    // Create local audio track
    const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
      encoderConfig: {
        sampleRate: 48000,
        stereo: false,
        bitrate: 48
      }
    });
    console.log('✅ Agora: Created local audio track');
    
    // Ensure audio track is enabled and set volume
    if (localAudioTrack) {
      localAudioTrack.setEnabled(true);
      localAudioTrack.setVolume(100);
      console.log('✅ Agora: Audio track enabled and volume set to 100');
    }
    
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
    
    // CRITICAL: Ensure audio track is still enabled AFTER publishing
    // Sometimes tracks get disabled during publish, so we re-enable them
    if (localAudioTrack) {
      try {
        // Double-check audio is enabled after publishing
        if (!localAudioTrack.enabled) {
          console.warn('⚠️ Audio track was disabled during publish, re-enabling...');
          localAudioTrack.setEnabled(true);
        }
        // Ensure volume is still set
        localAudioTrack.setVolume(100);
        console.log('✅ Agora: Verified audio track enabled and volume set after publish:', {
          enabled: localAudioTrack.enabled,
          volume: 100
        });
      } catch (audioError) {
        console.error('❌ Error configuring audio after publish:', audioError);
      }
    }
    
    return {
      localAudioTrack,
      localVideoTrack
    };
  } catch (error) {
    console.error('❌ Agora call join failed:', error);
    throw error;
  }
};

/**
 * Leave call and release resources
 */
export const leaveCall = async (
  client: IAgoraRTCClient,
  localAudioTrack: ILocalAudioTrack | null,
  localVideoTrack: ILocalVideoTrack | null
): Promise<void> => {
  try {
    console.log('🔴 Starting call cleanup...');
    
    // Unpublish tracks first
    try {
      const tracksToUnpublish = [];
      if (localAudioTrack) tracksToUnpublish.push(localAudioTrack);
      if (localVideoTrack) tracksToUnpublish.push(localVideoTrack);
      
      if (tracksToUnpublish.length > 0) {
        await client.unpublish(tracksToUnpublish);
        console.log('✅ Unpublished', tracksToUnpublish.length, 'local track(s)');
      }
    } catch (unpublishError) {
      console.warn('⚠️ Error unpublishing tracks:', unpublishError);
    }
    
    // Stop and close local tracks
    if (localAudioTrack) {
      try {
        // Stop the track first
        localAudioTrack.stop();
        // Get the underlying MediaStream and stop all tracks
        const audioStream = localAudioTrack.getMediaStreamTrack();
        if (audioStream) {
          audioStream.stop();
          console.log('✅ Stopped audio MediaStreamTrack');
        }
        // Close the track
        localAudioTrack.close();
        console.log('✅ Stopped and closed audio track');
      } catch (audioError) {
        console.warn('⚠️ Error stopping audio track:', audioError);
      }
    }
    
    if (localVideoTrack) {
      try {
        // Stop the track first
        localVideoTrack.stop();
        // Get the underlying MediaStream and stop all tracks
        const videoStream = localVideoTrack.getMediaStreamTrack();
        if (videoStream) {
          videoStream.stop();
          console.log('✅ Stopped video MediaStreamTrack (camera off)');
        }
        // Close the track
        localVideoTrack.close();
        console.log('✅ Stopped and closed video track');
      } catch (videoError) {
        console.warn('⚠️ Error stopping video track:', videoError);
        // Try to stop the MediaStreamTrack directly as fallback
        try {
          const videoStream = localVideoTrack.getMediaStreamTrack();
          if (videoStream) {
            videoStream.stop();
            console.log('✅ Fallback: Stopped video MediaStreamTrack');
          }
        } catch (fallbackError) {
          console.warn('⚠️ Fallback video stop also failed:', fallbackError);
        }
      }
    }
    
    // Leave the channel - ensure this always happens
    try {
      await client.leave();
      console.log('✅ Left Agora channel successfully');
    } catch (leaveError) {
      console.error('❌ Error leaving channel:', leaveError);
      // Try force leave even if normal leave fails
      try {
        await client.leave();
      } catch (forceLeaveError) {
        console.error('❌ Force leave also failed:', forceLeaveError);
      }
    }
    
    // Ensure client is fully cleaned up
    try {
      // Remove all event listeners
      client.removeAllListeners();
      console.log('✅ Removed all event listeners');
    } catch (listenerError) {
      console.warn('⚠️ Error removing listeners:', listenerError);
    }
    
    console.log('✅ Call cleanup completed');
  } catch (error) {
    console.error('❌ Error in leaveCall:', error);
    // Still try to leave channel even if other cleanup failed
    try {
      await client.leave();
    } catch (finalLeaveError) {
      console.error('❌ Final leave attempt failed:', finalLeaveError);
    }
    throw error;
  }
};

/**
 * Connection state types from Agora SDK
 */
export type ConnectionState = 
  | 'DISCONNECTED' 
  | 'CONNECTING' 
  | 'CONNECTED' 
  | 'RECONNECTING' 
  | 'DISCONNECTING';

/**
 * Get the current connection state of the Agora client
 * @param client - The Agora RTC client instance
 * @returns The current connection state, or null if client is not available
 */
export const getConnectionState = (client: IAgoraRTCClient | null): ConnectionState | null => {
  if (!client) {
    return null;
  }
  
  return client.connectionState as ConnectionState;
};

/**
 * Check if the Agora connection is established (CONNECTED state)
 * @param client - The Agora RTC client instance
 * @returns true if connected, false otherwise
 */
export const isConnected = (client: IAgoraRTCClient | null): boolean => {
  if (!client) {
    return false;
  }
  
  return client.connectionState === 'CONNECTED';
};

/**
 * Check if the Agora connection is in a connecting state (CONNECTING or RECONNECTING)
 * @param client - The Agora RTC client instance
 * @returns true if connecting or reconnecting, false otherwise
 */
export const isConnecting = (client: IAgoraRTCClient | null): boolean => {
  if (!client) {
    return false;
  }
  
  const state = client.connectionState;
  return state === 'CONNECTING' || state === 'RECONNECTING';
};

/**
 * Check if the Agora connection is disconnected
 * @param client - The Agora RTC client instance
 * @returns true if disconnected, false otherwise
 */
export const isDisconnected = (client: IAgoraRTCClient | null): boolean => {
  if (!client) {
    return true;
  }
  
  return client.connectionState === 'DISCONNECTED';
};

/**
 * Get detailed connection status information
 * @param client - The Agora RTC client instance
 * @returns Object with connection status details
 */
export const getConnectionStatus = (client: IAgoraRTCClient | null) => {
  if (!client) {
    return {
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      state: null,
      hasClient: false
    };
  }
  
  const state = client.connectionState as ConnectionState;
  
  return {
    isConnected: state === 'CONNECTED',
    isConnecting: state === 'CONNECTING' || state === 'RECONNECTING',
    isDisconnected: state === 'DISCONNECTED',
    isDisconnecting: state === 'DISCONNECTING',
    state,
    hasClient: true
  };
};

/**
 * Chat message interface for Agora RTC data streams
 */
export interface ChatMessage {
  id: string;
  senderId: number | string;
  senderName: string;
  content: string;
  timestamp: number;
}

/**
 * Send a chat message through Agora RTC data stream
 * Uses the same channel as the video/audio call
 * 
 * NOTE: Agora RTC SDK v4+ supports data streams via createDataStream and sendStreamMessage
 * If these methods don't exist, consider using Agora RTM SDK for messaging
 * 
 * @param client - The Agora RTC client instance
 * @param message - The message content
 * @param senderName - Name of the sender
 * @returns true if message was sent successfully
 */
export const sendChatMessage = async (
  client: IAgoraRTCClient | null,
  message: string,
  senderName: string
): Promise<boolean> => {
  if (!client) {
    console.error('❌ Cannot send message: Agora client not available');
    return false;
  }

  if (client.connectionState !== 'CONNECTED') {
    console.error('❌ Cannot send message: Not connected to channel');
    return false;
  }

  if (!message.trim()) {
    console.warn('⚠️ Cannot send empty message');
    return false;
  }

  try {
    const messageData: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: client.uid || 'unknown',
      senderName,
      content: message.trim(),
      timestamp: Date.now()
    };

    // Convert message to Uint8Array for Agora data stream
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(messageData));

    // Check if sendStreamMessage method exists (Agora RTC SDK v4.1+)
    if (typeof (client as any).sendStreamMessage === 'function') {
      // Send message through data stream (reliable, ordered)
      await (client as any).sendStreamMessage(data);
      console.log('✅ Chat message sent via RTC data stream:', messageData.content);
      return true;
    } else {
      // Fallback: Try createDataStream if available
      console.warn('⚠️ sendStreamMessage not available. Data streams may require Agora RTM SDK.');
      console.warn('   Consider using Agora RTM SDK for reliable messaging: npm install agora-rtm-sdk');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending chat message:', error);
    return false;
  }
};

/**
 * Setup chat message listener for Agora RTC data stream
 * 
 * NOTE: This requires Agora RTC SDK v4.1+ with data stream support
 * If 'stream-message' event is not available, consider using Agora RTM SDK
 * 
 * @param client - The Agora RTC client instance
 * @param onMessage - Callback function when a message is received
 * @returns Cleanup function to remove the listener
 */
export const setupChatMessageListener = (
  client: IAgoraRTCClient | null,
  onMessage: (message: ChatMessage) => void
): (() => void) => {
  if (!client) {
    console.warn('⚠️ Cannot setup message listener: Agora client not available');
    return () => {};
  }

  const handleStreamMessage = (uid: number | string, data: Uint8Array) => {
    try {
      const decoder = new TextDecoder();
      const messageText = decoder.decode(data);
      const message: ChatMessage = JSON.parse(messageText);
      
      console.log('📨 Chat message received from', uid, ':', message.content);
      onMessage(message);
    } catch (error) {
      console.error('❌ Error parsing chat message:', error);
    }
  };

  // Listen for stream messages (if event exists)
  if (typeof client.on === 'function') {
    try {
      client.on('stream-message' as any, handleStreamMessage);
      console.log('✅ Chat message listener setup');
    } catch (error) {
      console.warn('⚠️ stream-message event not available. Consider using Agora RTM SDK for messaging.');
    }
  }

  // Return cleanup function
  return () => {
    if (typeof client.off === 'function') {
      try {
        client.off('stream-message' as any, handleStreamMessage);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  };
};

