
import { useState, useCallback, useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

// Enhanced Agora hook with simplified auth
export const useAgoraCall = (expertId: number, expertPrice: number) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [callState, setCallState] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [callOperationId, setCallOperationId] = useState<string | null>(null);
  
  const { isAuthenticated } = useSimpleAuth();
  
  // Enhanced initialization with auth protection
  const initializeAgoraCall = useCallback(async () => {
    if (isInitialized) return;
    
    const operationId = `agora_init_${expertId}_${Date.now()}`;
    
    console.log('Initializing Agora call for expert:', expertId);
    
    try {
      setCallOperationId(operationId);
      
      // Store current auth state before Agora initialization
      const authSnapshot = {
        isAuthenticated,
        sessionType: localStorage.getItem('sessionType'),
        authToken: sessionStorage.getItem('supabase.auth.token')
      };
      
      console.log('Auth state before Agora init:', authSnapshot);
      
      // Mark video call as active to protect auth
      sessionStorage.setItem('videoCallActive', 'true');
      sessionStorage.setItem('activeCallExpertId', expertId.toString());
      
      // Import actual Agora service utilities
      try {
        const { createClient, joinCall } = await import('../utils/agoraService');
        
        setIsInitialized(true);
        console.log('Agora service modules loaded successfully');
        
        return { createClient, joinCall };
      } catch (importError) {
        console.error('Failed to load Agora service:', importError);
        setIsInitialized(true);
        return null;
      }
    } catch (error) {
      console.error('Error initializing Agora:', error);
      setCallError('Failed to initialize video call');
    }
  }, [expertId, isInitialized, isAuthenticated]);

  const startCall = async (duration: number, callType: 'video' | 'voice' = 'video') => {
    try {
      console.log('Starting call');
      
      if (!callOperationId) {
        const operationId = `call_${expertId}_${Date.now()}`;
        setCallOperationId(operationId);
      }
      
      // Enhanced auth protection during call initialization
      sessionStorage.setItem('videoCallActive', 'true');
      sessionStorage.setItem('callInProgress', 'true');
      sessionStorage.setItem('activeCallExpertId', expertId.toString());
      
      await initializeAgoraCall();
      
      // Simulate call start (replace with actual Agora implementation)
      setCallState({ 
        isJoined: true, 
        callType,
        isMuted: false,
        isVideoEnabled: callType === 'video',
        isAudioEnabled: true
      });
      setDuration(0);
      setRemainingTime(duration * 60);
      
      console.log('Call started successfully');
      return true;
    } catch (error) {
      console.error('Error starting call:', error);
      setCallError('Failed to start call');
      return false;
    }
  };

  const endCall = async () => {
    try {
      console.log('Ending call');
      
      const result = { success: true, cost };
      
      // Clear call-specific session storage
      sessionStorage.removeItem('callInProgress');
      sessionStorage.removeItem('activeCallExpertId');
      
      // Clear call state
      setCallState(null);
      
      // Delay cleanup to ensure smooth transition
      setTimeout(() => {
        setCallOperationId(null);
        sessionStorage.removeItem('videoCallActive');
        console.log('Call cleanup completed');
      }, 3000); // 3 second delay for cleanup
      
      return result;
    } catch (error) {
      console.error('Error ending call:', error);
      return { success: false, cost: 0 };
    }
  };

  const handleToggleMute = () => {
    console.log('Toggle mute');
    setCallState((prev: any) => prev ? { ...prev, isMuted: !prev.isMuted } : prev);
  };

  const handleToggleVideo = () => {
    console.log('Toggle video');
    setCallState((prev: any) => prev ? { ...prev, isVideoEnabled: !prev.isVideoEnabled } : prev);
  };

  const extendCall = async (additionalMinutes: number) => {
    console.log('Extending call');
    setIsExtending(true);
    
    try {
      setRemainingTime(prev => prev + (additionalMinutes * 60));
      
      setTimeout(() => {
        setIsExtending(false);
      }, 1000);
    } catch (error) {
      console.error('Error extending call:', error);
      setIsExtending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    callState,
    callType: 'video' as const,
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
    isProtected: !!callOperationId
  };
};
