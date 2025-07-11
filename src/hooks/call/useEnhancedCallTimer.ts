
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

export const useEnhancedCallTimer = (sessionPrice: number) => {
  const [duration, setDuration] = useState(0);
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState(60);
  const [extensionMinutes, setExtensionMinutes] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for warnings
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSsFJHfH8N2QQAoUXrTp66hVFApGn+Xyv2UXBzp01/LOeSs=');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const totalDurationMinutes = selectedDurationMinutes + extensionMinutes;
  const totalDurationSeconds = totalDurationMinutes * 60;
  const remainingTime = Math.max(0, totalDurationSeconds - duration);
  const isOvertime = duration > totalDurationSeconds;
  const warningThreshold = totalDurationSeconds - 180; // 3 minutes warning
  const isInWarningPeriod = duration > warningThreshold && !isOvertime;

  // Calculate cost as fixed session price
  const totalCost = sessionPrice;

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Warning system
  useEffect(() => {
    if (isInWarningPeriod && !hasShownWarning) {
      const remainingMinutes = Math.ceil(remainingTime / 60);
      toast.warning(`Call ending in ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`, {
        duration: 5000,
        action: {
          label: 'Extend Call',
          onClick: () => {
            // This will be handled by the parent component
            console.log('Extension requested from warning');
          }
        }
      });
      setHasShownWarning(true);
    }

    // Audio warning for last 10 seconds
    if (remainingTime <= 10 && remainingTime > 0 && !hasPlayedAudio && !isOvertime) {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
      setHasPlayedAudio(true);
    }

    // Reset warnings after extension
    if (remainingTime > 180) {
      setHasShownWarning(false);
      setHasPlayedAudio(false);
    }
  }, [isInWarningPeriod, hasShownWarning, remainingTime, hasPlayedAudio, isOvertime]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  }, []);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(false);
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setDuration(0);
    setExtensionMinutes(0);
    setHasShownWarning(false);
    setHasPlayedAudio(false);
  }, [stopTimer]);

  const extendCall = useCallback(async (additionalMinutes: number): Promise<boolean> => {
    setIsExtending(true);
    
    try {
      // Simulate extension process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setExtensionMinutes(prev => prev + additionalMinutes);
      setHasShownWarning(false);
      setHasPlayedAudio(false);
      
      console.log(`Call extended by ${additionalMinutes} minutes`);
      return true;
    } catch (error) {
      console.error('Extension failed:', error);
      return false;
    } finally {
      setIsExtending(false);
    }
  }, []);

  // Combined start function for compatibility
  const startTimers = useCallback(() => {
    startTimer();
  }, [startTimer]);

  const stopTimers = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const calculateFinalCost = useCallback(() => {
    return totalCost;
  }, [totalCost]);

  const getTimerStatus = useCallback(() => {
    if (isOvertime) return 'overtime';
    if (isInWarningPeriod) return 'warning';
    return 'normal';
  }, [isOvertime, isInWarningPeriod]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    duration,
    selectedDurationMinutes,
    extensionMinutes,
    totalDurationMinutes,
    remainingTime,
    totalCost,
    isPaused,
    isExtending,
    isOvertime,
    isInWarningPeriod,
    formatTime,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    extendCall,
    startTimers,
    stopTimers,
    calculateFinalCost,
    getTimerStatus,
    setSelectedDurationMinutes
  };
};
