
import { useState, useCallback, useEffect } from 'react';
import { useEnhancedUnifiedAuth } from '@/contexts/auth/EnhancedUnifiedAuthContext';
import { useAuthProtection } from '@/utils/authProtection';

// Enhanced Agora hook with comprehensive auth protection
export const useAgoraCall = (expertId: number, expertPrice: number) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [callState, setCallState] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [callOperationId, setCallOperationId] = useState<string | null>(null);
  
  const { isAuthenticated, startAuthProtection, endAuthProtection } = useEnhancedUnifiedAuth();
  const { startProtection, endProtection } = useAuthProtection();
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callOperationId) {
        endAuthProtection(callOperationId);
        endProtection(callOperationId);
      }
    };
  }, [callOperationId, endAuthProtection, endProtection]);
  
  // Enhanced initialization with comprehensive auth protection
  const initializeAgoraCall = useCallback(async () => {
    if (isInitialized) return;
    
    const operationId = `agora_init_${expertId}_${Date.now()}`;
    
    console.log('🔒 Initializing Agora call with comprehensive auth protection for expert:', expertId);
    
    try {
      // Start both levels of auth protection
      startAuthProtection(operationId, 'video-call');
      startProtection(operationId, 'video-call');
      setCallOperationId(operationId);
      
      // Store current auth state before Agora initialization
      const authSnapshot = {
        isAuthenticated,
        sessionType: localStorage.getItem('sessionType'),
        authToken: sessionStorage.getItem('supabase.auth.token')
      };
      
      console.log('🔒 Auth state before Agora init:', authSnapshot);
      
      // Mark video call as active to protect auth
      sessionStorage.setItem('videoCallActive', 'true');
      sessionStorage.setItem('activeCallExpertId', expertId.toString());
      
      // Dynamic import of actual Agora modules (when available)
      try {
        const { useCallState } = await import('./call/useCallState');
        const { useCallTimer } = await import('./call/useCallTimer');
        const { useCallOperations } = await import('./call/useCallOperations');
        
        setIsInitialized(true);
        console.log('🔒 Agora modules loaded successfully with auth protection');
        
        return { useCallState, useCallTimer, useCallOperations };
      } catch (importError) {
        console.log('🔒 Agora modules not available, using fallback implementation');
        setIsInitialized(true);
        return null;
      }
    } catch (error) {
      console.error('🔒 Error initializing Agora with auth protection:', error);
      setCallError('Failed to initialize video call');
      
      // Cleanup on error
      if (operationId) {
        endAuthProtection(operationId);
        endProtection(operationId);
      }
    }
  }, [expertId, isInitialized, isAuthenticated, startAuthProtection, startProtection]);

  const startCall = async (duration: number, callType: 'video' | 'voice' = 'video') => {
    try {
      console.log('🔒 Starting call with comprehensive auth protection');
      
      if (!callOperationId) {
        const operationId = `call_${expertId}_${Date.now()}`;
        startAuthProtection(operationId, 'video-call');
        startProtection(operationId, 'video-call');
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
      
      console.log('🔒 Call started successfully with comprehensive auth protection');
      return true;
    } catch (error) {
      console.error('🔒 Error starting call:', error);
      setCallError('Failed to start call');
      return false;
    }
  };

  const endCall = async () => {
    try {
      console.log('🔒 Ending call, maintaining auth state during cleanup');
      
      const result = { success: true, cost };
      
      // Clear call-specific session storage
      sessionStorage.removeItem('callInProgress');
      sessionStorage.removeItem('activeCallExpertId');
      
      // Clear call state but maintain auth protection briefly for cleanup
      setCallState(null);
      
      // Delay auth protection removal to ensure smooth transition
      setTimeout(() => {
        if (callOperationId) {
          endAuthProtection(callOperationId);
          endProtection(callOperationId);
          setCallOperationId(null);
        }
        sessionStorage.removeItem('videoCallActive');
        console.log('🔒 Auth protection removed after call end cleanup');
      }, 3000); // 3 second delay for cleanup
      
      return result;
    } catch (error) {
      console.error('🔒 Error ending call:', error);
      return { success: false, cost: 0 };
    }
  };

  const handleToggleMute = () => {
    console.log('🔒 Toggle mute with auth protection');
    setCallState((prev: any) => prev ? { ...prev, isMuted: !prev.isMuted } : prev);
  };

  const handleToggleVideo = () => {
    console.log('🔒 Toggle video with auth protection');
    setCallState((prev: any) => prev ? { ...prev, isVideoEnabled: !prev.isVideoEnabled } : prev);
  };

  const extendCall = async (additionalMinutes: number) => {
    console.log('🔒 Extending call with auth protection');
    setIsExtending(true);
    
    try {
      // Extend auth protection for the additional time
      if (callOperationId) {
        const extendedTime = Date.now() + (additionalMinutes * 60 * 1000);
        sessionStorage.setItem(`authProtection_${callOperationId}_extended`, extendedTime.toString());
      }
      
      setRemainingTime(prev => prev + (additionalMinutes * 60));
      
      setTimeout(() => {
        setIsExtending(false);
      }, 1000);
    } catch (error) {
      console.error('🔒 Error extending call:', error);
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
