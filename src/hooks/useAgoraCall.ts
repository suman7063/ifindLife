
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseAgoraCallProps {
  expertId: string;
  userId: string;
  callType: 'audio' | 'video';
  onError?: (error: string) => void;
}

export const useAgoraCall = ({ expertId, userId, callType, onError }: UseAgoraCallProps) => {
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(900); // 15 minutes in seconds
  const [isExtending, setIsExtending] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  
  // Format time function
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start call
  const startCall = async (): Promise<boolean> => {
    try {
      if (!expertId) {
        const error = 'Expert ID is required';
        setCallError(error);
        onError?.(error);
        return false;
      }
      
      // Simulate call setup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error starting call:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start call';
      setCallError(errorMessage);
      onError?.(errorMessage);
      return false;
    }
  };
  
  // End call
  const endCall = () => {
    // Stop timers and clean up resources
    setDuration(0);
    setCost(0);
    setRemainingTime(900);
  };
  
  // Toggle mute
  const handleToggleMute = () => {
    // Implement actual mute logic here
    return true;
  };
  
  // Toggle video
  const handleToggleVideo = () => {
    // Implement actual video toggle logic here
    return true;
  };
  
  // Extend call
  const extendCall = async (additionalMinutes: number) => {
    setIsExtending(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add time
      setRemainingTime(prev => prev + (additionalMinutes * 60));
      
      toast.success(`Call extended by ${additionalMinutes} minutes`);
    } catch (error) {
      console.error('Error extending call:', error);
      toast.error('Failed to extend call');
    } finally {
      setIsExtending(false);
    }
  };
  
  return {
    callState: { isConnected: false, hasJoined: false },
    callType,
    duration,
    cost,
    remainingTime,
    isExtending,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime,
  };
};
