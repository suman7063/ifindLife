import { useState, useRef, useCallback } from 'react';
import { calculateCallCost } from '@/utils/agoraService';

export const useCallTimer = (expertPrice: number) => {
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);
  const [isExtending, setIsExtending] = useState(false);
  const [remainingTime, setRemainingTime] = useState(15 * 60); // 15 minutes in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialSlot = 15 * 60; // 15 minutes in seconds
  const initialSlotMinutes = initialSlot / 60; // Convert to minutes for calculation

  const startTimers = useCallback(() => {
    durationTimerRef.current = setInterval(() => {
      setDuration(prev => {
        const newDuration = prev + 1;
        
        if (newDuration > initialSlot) {
          // Ensure we're passing all required arguments to calculateCallCost
          setCost(calculateCallCost(newDuration, expertPrice, initialSlotMinutes));
        }
        
        return newDuration;
      });
    }, 1000);

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setIsExtending(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [expertPrice, initialSlotMinutes]);

  const stopTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  const extendCall = useCallback(() => {
    setRemainingTime(prev => prev + 15 * 60);
    setIsExtending(false);
  }, []);

  const calculateFinalCost = useCallback((): number => {
    if (duration <= initialSlot) {
      return 0;
    }
    
    // Ensure we're passing all required arguments here as well
    return calculateCallCost(duration, expertPrice, initialSlotMinutes);
  }, [duration, expertPrice, initialSlot, initialSlotMinutes]);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  }, []);

  return {
    duration,
    cost,
    remainingTime,
    isExtending,
    startTimers,
    stopTimers,
    extendCall,
    calculateFinalCost,
    formatTime,
    initialSlotMinutes
  };
};
