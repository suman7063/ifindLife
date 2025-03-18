
import { useState, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, IMicrophoneAudioTrack, ICameraVideoTrack, ILocalTrack } from 'agora-rtc-sdk-ng';
import { useUserAuth } from '@/hooks/useUserAuth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Agora client options
const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || '';

// Custom hook for Agora client creation and management
export const useAgora = () => {
  // Create an Agora client instance
  const createClient = () => {
    return AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  };

  // Create a microphone audio track
  const createMicrophoneTrack = async () => {
    return await AgoraRTC.createMicrophoneAudioTrack();
  };

  // Create a camera video track
  const createCameraTrack = async () => {
    return await AgoraRTC.createCameraVideoTrack();
  };

  // Generate a token (this would typically be done server-side)
  // This is a mock implementation for demo purposes
  const generateToken = (channelName: string) => {
    // In a real app, this would be a secure server call
    // For demo, we're just returning a random string
    return uuidv4();
  };

  // Generate a unique channel name for a session
  const generateChannelName = (expertId: string, userId: string) => {
    return `session_${expertId}_${userId}_${Date.now()}`;
  };

  // Added missing methods that are used in components
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

  const useMicrophoneAndCameraTracks = () => {
    const [tracks, setTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      const initTracks = async () => {
        try {
          setLoading(true);
          const audioTrack = await createMicrophoneTrack();
          const videoTrack = await createCameraTrack();
          setTracks([audioTrack, videoTrack]);
        } catch (err) {
          setError(err as Error);
          toast.error('Error initializing audio and video tracks');
          console.error('Error initializing audio and video tracks:', err);
        } finally {
          setLoading(false);
        }
      };
  
      initTracks();
  
      return () => {
        if (tracks) {
          tracks[0].close();
          tracks[1].close();
        }
      };
    }, []);
  
    return { tracks, loading, error };
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
