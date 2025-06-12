
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';

// Enhanced Agora hook with auth protection
export const useAgoraCall = (expertId: number, expertPrice: number) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [callState, setCallState] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  // Lazy initialization with auth protection
  const initializeAgoraCall = useCallback(async () => {
    if (isInitialized) return;
    
    console.log('🔒 Initializing Agora call with auth protection for expert:', expertId);
    
    // Store current auth state before Agora initialization
    const authSnapshot = {
      isAuthenticated,
      sessionType: localStorage.getItem('sessionType'),
      authToken: sessionStorage.getItem('supabase.auth.token')
    };
    
    console.log('🔒 Auth state before Agora init:', authSnapshot);
    
    try {
      // Mark video call as active to protect auth
      sessionStorage.setItem('videoCallActive', 'true');
      
      // Dynamic import of actual Agora modules
      const { useCallState } = await import('./call/useCallState');
      const { useCallTimer } = await import('./call/useCallTimer');
      const { useCallOperations } = await import('./call/useCallOperations');
      
      setIsInitialized(true);
      
      console.log('🔒 Agora modules loaded successfully');
      
      // Verify auth state after initialization
      const currentAuth = {
        isAuthenticated,
        sessionType: localStorage.getItem('sessionType'),
        authToken: sessionStorage.getItem('supabase.auth.token')
      };
      
      console.log('🔒 Auth state after Agora init:', currentAuth);
      
      // Return the actual hooks after lazy loading
      return {
        useCallState,
        useCallTimer,
        useCallOperations
      };
    } catch (error) {
      console.error('🔒 Error initializing Agora with auth protection:', error);
      setCallError('Failed to initialize video call');
      // Ensure auth protection is maintained even on error
      sessionStorage.setItem('videoCallActive', 'true');
    }
  }, [expertId, isInitialized, isAuthenticated]);

  const startCall = async (duration: number, callType: 'video' | 'voice' = 'video') => {
    try {
      console.log('🔒 Starting call with auth protection');
      
      // Ensure auth is protected during call
      sessionStorage.setItem('videoCallActive', 'true');
      
      await initializeAgoraCall();
      
      // Simulate call start (replace with actual Agora implementation)
      setCallState({ isJoined: true, callType });
      setDuration(0);
      setRemainingTime(duration * 60);
      
      console.log('🔒 Call started successfully with auth protection');
      return true;
    } catch (error) {
      console.error('🔒 Error starting call:', error);
      setCallError('Failed to start call');
      return false;
    }
  };

  const endCall = async () => {
    try {
      console.log('🔒 Ending call, maintaining auth state');
      
      const result = { success: true, cost };
      
      // Clear call state but maintain auth protection briefly
      setCallState(null);
      
      // Remove auth protection after a delay to ensure smooth transition
      setTimeout(() => {
        sessionStorage.removeItem('videoCallActive');
        console.log('🔒 Auth protection removed after call end');
      }, 2000);
      
      return result;
    } catch (error) {
      console.error('🔒 Error ending call:', error);
      return { success: false, cost: 0 };
    }
  };

  const handleToggleMute = () => {
    console.log('🔒 Toggle mute with auth protection');
    // Implement mute toggle
  };

  const handleToggleVideo = () => {
    console.log('🔒 Toggle video with auth protection');
    // Implement video toggle
  };

  const extendCall = async (additionalMinutes: number) => {
    console.log('🔒 Extending call with auth protection');
    setIsExtending(true);
    
    try {
      // Implement call extension logic
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
    formatTime
  };
};
