
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { toast } from 'sonner';

interface AgoraCallHookReturn {
  isInCall: boolean;
  isConnecting: boolean;
  callState: string;
  duration: number;
  cost: number;
  remainingTime: number;
  callError: string | null;
  startCall: (expertId: string, serviceType?: string) => Promise<boolean>;
  endCall: (reason?: string) => Promise<{ success: boolean; cost?: number }>;
  handleToggleMute: () => void;
  handleToggleVideo: () => void;
  extendCall: (minutes: number) => Promise<boolean>;
  formatTime: (seconds: number) => string;
}

export const useAgoraCall = (): AgoraCallHookReturn => {
  const { isAuthenticated, user } = useAuth();
  const [isInCall, setIsInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callState, setCallState] = useState('idle');
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [callError, setCallError] = useState<string | null>(null);

  const startCall = useCallback(async (expertId: string, serviceType?: string): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      setCallError('Please log in to start a call');
      toast.error('Please log in to start a call');
      return false;
    }

    try {
      setIsConnecting(true);
      setCallError(null);
      setCallState('connecting');
      console.log('Starting call with expert:', expertId, 'Service type:', serviceType);
      
      // Simulate call initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsInCall(true);
      setCallState('connected');
      toast.success('Call started successfully');
      return true;
    } catch (error) {
      console.error('Error starting call:', error);
      setCallError('Failed to start call');
      setCallState('error');
      toast.error('Failed to start call');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isAuthenticated, user]);

  const endCall = useCallback(async (reason?: string): Promise<{ success: boolean; cost?: number }> => {
    setIsInCall(false);
    setIsConnecting(false);
    setCallState('ended');
    const finalCost = cost;
    setDuration(0);
    setCost(0);
    setRemainingTime(0);
    console.log('Call ended', reason ? `Reason: ${reason}` : '');
    toast.info('Call ended');
    return { success: true, cost: finalCost };
  }, [cost]);

  const handleToggleMute = useCallback(() => {
    console.log('Toggle mute');
    // Implementation for mute toggle
  }, []);

  const handleToggleVideo = useCallback(() => {
    console.log('Toggle video');
    // Implementation for video toggle
  }, []);

  const extendCall = useCallback(async (minutes: number): Promise<boolean> => {
    console.log('Extending call by', minutes, 'minutes');
    setRemainingTime(prev => prev + (minutes * 60));
    // Implementation for call extension
    return true;
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isInCall,
    isConnecting,
    callState,
    duration,
    cost,
    remainingTime,
    callError,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    extendCall,
    formatTime
  };
};
