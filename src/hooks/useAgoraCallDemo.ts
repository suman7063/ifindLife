import { useState, useCallback, useEffect, useRef } from 'react';
import { CallState } from '@/utils/agoraService';
import { toast } from 'sonner';

export const useAgoraCallDemo = (expertPrice: number) => {
  const [callState, setCallState] = useState<CallState | null>(null);
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [callError, setCallError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock start call for demo
  const startCall = useCallback(async (selectedDuration: number, callType: 'video' | 'voice' = 'video') => {
    setIsConnecting(true);
    setCallError(null);

    try {
      console.log('🎯 Starting demo call...');
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create mock call state
      setCallState({
        localAudioTrack: null, // Mock track
        localVideoTrack: callType === 'video' ? {} as any : null, // Mock track
        remoteUsers: [],
        client: {} as any, // Mock client
        isJoined: true,
        isMuted: false,
        isVideoEnabled: callType === 'video',
        isAudioEnabled: true
      });

      // Set timers
      setDuration(0);
      setRemainingTime(selectedDuration * 60);
      setCost(selectedDuration * expertPrice);

      // Start demo timers
      durationTimerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            endCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulate expert joining after 3 seconds
      setTimeout(() => {
        setCallState(prev => prev ? {
          ...prev,
          remoteUsers: [{
            uid: 'expert-demo',
            audioTrack: {} as any,
            videoTrack: callType === 'video' ? {} as any : null,
            hasAudio: true,
            hasVideo: callType === 'video'
          }]
        } : prev);
        toast.success('Expert joined the call');
      }, 3000);

      toast.success('Demo call started successfully!');
      return true;

    } catch (error) {
      console.error('❌ Error starting demo call:', error);
      setCallError('Demo mode: Simulated connection error');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [expertPrice]);

  // End call
  const endCall = useCallback(async () => {
    try {
      console.log('🛑 Ending demo call...');

      // Clear timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      // Reset state
      setCallState(null);
      
      toast.success('Demo call ended');
      return { success: true, cost };

    } catch (error) {
      console.error('❌ Error ending demo call:', error);
      return { success: false, cost: 0 };
    }
  }, [cost]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, []);

  const handleToggleMute = useCallback(() => {
    if (callState) {
      setCallState(prev => prev ? { ...prev, isMuted: !prev.isMuted } : prev);
      toast.info(`Demo: Microphone ${!callState.isMuted ? 'muted' : 'unmuted'}`);
    }
  }, [callState]);

  const handleToggleVideo = useCallback(() => {
    if (callState) {
      setCallState(prev => prev ? { ...prev, isVideoEnabled: !prev.isVideoEnabled } : prev);
      toast.info(`Demo: Camera ${!callState.isVideoEnabled ? 'disabled' : 'enabled'}`);
    }
  }, [callState]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    callState,
    duration,
    cost,
    remainingTime,
    callError,
    isConnecting,
    startCall,
    endCall,
    handleToggleMute,
    handleToggleVideo,
    formatTime
  };
};