
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/UnifiedAuthContext';
import { toast } from 'sonner';
import { CallState } from '@/utils/agoraService';

interface AgoraCallHookReturn {
  isInCall: boolean;
  isConnecting: boolean;
  callState: CallState;
  callStatus: string;
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
  const [callState, setCallState] = useState<CallState>({
    localAudioTrack: null,
    localVideoTrack: null,
    remoteUsers: [],
    client: null,
    isJoined: false,
    isMuted: false,
    isVideoEnabled: true,
    isAudioEnabled: true
  });
  const [callStatus, setCallStatus] = useState('idle');
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
      setCallStatus('connecting');
      console.log('Starting call with expert:', expertId, 'Service type:', serviceType);
      
      // Simulate call initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsInCall(true);
      setCallStatus('connected');
      setCallState(prev => ({
        ...prev,
        isJoined: true,
        isVideoEnabled: true,
        isAudioEnabled: true
      }));
      toast.success('Call started successfully');
      return true;
    } catch (error) {
      console.error('Error starting call:', error);
      setCallError('Failed to start call');
      setCallStatus('error');
      toast.error('Failed to start call');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isAuthenticated, user]);

  const endCall = useCallback(async (reason?: string): Promise<{ success: boolean; cost?: number }> => {
    setIsInCall(false);
    setIsConnecting(false);
    setCallStatus('ended');
    setCallState(prev => ({
      ...prev,
      isJoined: false,
      localAudioTrack: null,
      localVideoTrack: null,
      remoteUsers: []
    }));
    const finalCost = cost;
    setDuration(0);
    setCost(0);
    setRemainingTime(0);
    console.log('Call ended', reason ? `Reason: ${reason}` : '');
    toast.info('Call ended');
    return { success: true, cost: finalCost };
  }, [cost]);

  const handleToggleMute = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
      isAudioEnabled: prev.isMuted
    }));
    console.log('Toggle mute');
  }, []);

  const handleToggleVideo = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isVideoEnabled: !prev.isVideoEnabled
    }));
    console.log('Toggle video');
  }, []);

  const extendCall = useCallback(async (minutes: number): Promise<boolean> => {
    console.log('Extending call by', minutes, 'minutes');
    setRemainingTime(prev => prev + (minutes * 60));
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
    callStatus,
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
