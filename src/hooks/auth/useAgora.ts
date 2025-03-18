
import { useState, useEffect } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  IMicrophoneAudioTrack, 
  ICameraVideoTrack,
  IAgoraRTCRemoteUser
} from 'agora-rtc-sdk-ng';

// Setup Agora client
const APP_ID = "your-agora-app-id"; // Replace with actual Agora App ID

export const useAgora = () => {
  const createClient = () => {
    return AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  };

  const createMicrophoneTrack = async () => {
    return await AgoraRTC.createMicrophoneAudioTrack();
  };

  const createCameraTrack = async () => {
    return await AgoraRTC.createCameraVideoTrack();
  };

  // Generate a token for joining a channel
  const generateToken = (channelName: string) => {
    // In a production app, token should be generated on the server
    // This is a placeholder for demo purposes only
    return `006${APP_ID}${Date.now()}${channelName}`;
  };

  // Generate a unique channel name for a call between expert and user
  const generateChannelName = (expertId: string, userId: string) => {
    return `call_${expertId}_${userId}_${Date.now()}`;
  };

  // New hook for using the Agora client
  const useClient = () => {
    const [client, setClient] = useState<IAgoraRTCClient | null>(null);
    
    useEffect(() => {
      const agoraClient = createClient();
      setClient(agoraClient);
      
      return () => {
        if (client) {
          client.leave();
        }
      };
    }, []);
    
    return client;
  };

  // New hook for using microphone and camera tracks
  const useMicrophoneAndCameraTracks = () => {
    const [tracks, setTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
    const [ready, setReady] = useState<boolean>(false);
    
    useEffect(() => {
      const getMicrophoneAndCameraTracks = async () => {
        try {
          const audioTrack = await createMicrophoneTrack();
          const videoTrack = await createCameraTrack();
          setTracks([audioTrack, videoTrack]);
          setReady(true);
        } catch (error) {
          console.error("Error creating tracks:", error);
        }
      };
      
      getMicrophoneAndCameraTracks();
      
      return () => {
        if (tracks) {
          tracks[0].close();
          tracks[1].close();
        }
      };
    }, []);
    
    return { tracks, ready };
  };

  return {
    createClient,
    createMicrophoneTrack,
    createCameraTrack,
    generateToken,
    generateChannelName,
    useClient,
    useMicrophoneAndCameraTracks
  };
};

export default useAgora;
