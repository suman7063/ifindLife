
import { useState } from 'react';
import { CallState } from './call/useCallState';

// Define the hook for Agora calls
export const useAgoraCall = ({ 
  expertId, 
  userId, 
  callType,
  onError
}: {
  expertId: string;
  userId: string;
  callType: 'audio' | 'video';
  onError: (error: string) => void;
}) => {
  const [callState, setCallState] = useState<CallState>({
    isConnecting: false,
    isConnected: false,
    hasJoined: false,
    hasError: false,
    isMuted: false,
    isVideoEnabled: true,
    localAudioTrack: null,
    localVideoTrack: null,
    remoteAudioTrack: null,
    remoteVideoTrack: null,
  });
  
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const [isExtending, setIsExtending] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);

  // Start a call with provided type
  const startCall = async (type: 'audio' | 'video'): Promise<boolean> => {
    try {
      setCallState(prev => ({...prev, isConnecting: true}));
      // Mock implementation
      setTimeout(() => {
        setCallState(prev => ({
          ...prev,
          isConnecting: false,
          isConnected: true,
          hasJoined: true
        }));
      }, 1500);
      return true;
    } catch (error) {
      console.error('Failed to start call:', error);
      onError('Failed to establish connection');
      setCallState(prev => ({...prev, hasError: true, isConnecting: false}));
      return false;
    }
  };

  // End ongoing call
  const endCall = () => {
    setCallState(prev => ({
      ...prev,
      isConnected: false,
      hasJoined: false
    }));
  };

  // Extend call duration
  const extendCall = (minutes: number) => {
    setIsExtending(true);
    // Mock extension logic
    setTimeout(() => {
      setRemainingTime(prev => prev + minutes * 60);
      setIsExtending(false);
    }, 1000);
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    callState,
    setCallState,
    duration,
    cost,
    remainingTime,
    isExtending,
    callError,
    startCall,
    endCall,
    extendCall,
    formatTime
  };
};
