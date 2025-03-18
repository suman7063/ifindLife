
import { useState, useEffect } from 'react';
import { 
  IAgoraRTCClient, 
  IAgoraRTCRemoteUser, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  createClient,
  createMicrophoneAndCameraTracks
} from 'agora-rtc-sdk-ng';
import { toast } from 'sonner';
import { UserProfile } from '@/types/supabase';

// Agora app credentials - in a production app, these would be stored in environment variables
// and accessed via a secure backend
const appId = 'your-agora-app-id'; // Replace with your Agora App ID

// Configure Agora client
const config = {
  mode: 'rtc' as const,
  codec: 'vp8' as const,
};

export interface VideoCallSession {
  channelName: string;
  token: string;
  uid: number;
  expertId: string;
  expertName: string;
}

export const useAgora = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Create Agora client and tracks hooks
  const useClient = () => {
    const [client, setClient] = useState<IAgoraRTCClient | null>(null);
    
    useEffect(() => {
      const agoraClient = createClient(config);
      setClient(agoraClient);
      
      return () => {
        if (client) {
          client.removeAllListeners();
        }
      };
    }, []);
    
    return client;
  };
  
  const useMicrophoneAndCameraTracks = () => {
    const [tracks, setTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
      // Create tracks
      const createAudioAndVideoTracks = async () => {
        try {
          const audioAndVideoTracks = await createMicrophoneAndCameraTracks();
          setTracks(audioAndVideoTracks);
          setReady(true);
        } catch (error) {
          console.error('Error creating tracks:', error);
          toast.error('Could not access camera and microphone');
        }
      };
      
      createAudioAndVideoTracks();
      
      return () => {
        if (tracks) {
          tracks[0].close();
          tracks[1].close();
        }
      };
    }, []);
    
    return { tracks, ready };
  };
  
  // Generate a token for joining a channel
  // In a production app, this would be done on the backend for security
  const generateToken = (channelName: string): string => {
    // This is a placeholder. In production, tokens should be generated on the server
    // with proper authentication
    return 'dummy-token-' + channelName;
  };
  
  // Generate a unique channel name based on the provider and user
  const generateChannelName = (expertId: string, userId: string): string => {
    return `session_${expertId}_${userId}_${Date.now()}`;
  };
  
  // Start an immediate session with a provider
  const startVideoSession = (user: UserProfile | null, expertId: string, expertName: string): VideoCallSession | null => {
    setIsLoading(true);
    
    try {
      if (!user) {
        toast.error('You must be logged in to start a video session');
        return null;
      }
      
      const channelName = generateChannelName(expertId, user.id);
      const token = generateToken(channelName);
      const uid = Math.floor(Math.random() * 1000000);
      
      setIsLoading(false);
      toast.success(`Starting video session with ${expertName}`);
      
      return {
        channelName,
        token,
        uid,
        expertId,
        expertName
      };
      
    } catch (error) {
      console.error('Error starting Agora session:', error);
      toast.error('Failed to start video session');
      setIsLoading(false);
      return null;
    }
  };
  
  // Join a scheduled session
  const joinScheduledSession = (channelName: string, token: string, uid: number): boolean => {
    try {
      // In a real implementation, you would set up the client to join the channel
      toast.success('Joining scheduled video session');
      return true;
    } catch (error) {
      console.error('Error joining scheduled session:', error);
      toast.error('Failed to join video session');
      return false;
    }
  };
  
  return {
    useClient,
    useMicrophoneAndCameraTracks,
    startVideoSession,
    joinScheduledSession,
    isLoading,
    generateToken,
    generateChannelName
  };
};
