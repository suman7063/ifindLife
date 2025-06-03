
import { useState, useEffect, useRef, useCallback } from 'react';

export const useCallTimer = (pricePerMinute: number) => {
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Free tier: first 15 minutes are free
  const FREE_MINUTES = 15;
  const freeSeconds = FREE_MINUTES * 60;

  const cost = Math.max(0, (duration - freeSeconds) / 60) * pricePerMinute;
  const remainingTime = Math.max(0, freeSeconds - duration);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    
    startTimeRef.current = new Date();
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
    pausedTimeRef.current = duration;
  }, [duration]);

  const resumeTimer = useCallback(() => {
    if (isPaused) {
      startTimer();
    }
  }, [isPaused, startTimer]);

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
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [stopTimer]);

  const extendCall = useCallback(async (additionalMinutes: number = 15) => {
    setIsExtending(true);
    
    // Simulate extension process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsExtending(false);
    return true;
  }, []);

  // Combined start function for both timer and other systems
  const startTimers = useCallback(() => {
    startTimer();
  }, [startTimer]);

  const stopTimers = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const calculateFinalCost = useCallback(() => {
    return cost;
  }, [cost]);

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
    cost,
    remainingTime,
    isPaused,
    isExtending,
    formatTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    extendCall,
    startTimers,
    stopTimers,
    calculateFinalCost
  };
};
