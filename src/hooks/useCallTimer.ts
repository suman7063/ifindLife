
import { useState, useEffect } from 'react';

export interface UseCallTimerReturn {
  duration: number;
  cost: number;
  remainingTime: number;
  isExtending: boolean;
  startTimers: (initialDuration: number, ratePerMinute: number) => void;
  stopTimers: () => void;
  extendCall: (additionalMinutes: number) => void;
  calculateFinalCost: () => number;
  formatTime: (seconds: number) => string;
}

export const useCallTimer = (ratePerMinute: number = 0): UseCallTimerReturn => {
  const [duration, setDuration] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isExtending, setIsExtending] = useState<boolean>(false);
  const [initialSlot, setInitialSlot] = useState<number>(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
        setDuration(prevDuration => prevDuration + 1);
        
        // Calculate cost only after initial free minutes
        if (duration >= initialSlot) {
          setCost(prevCost => prevCost + (ratePerMinute / 60));
        }
      }, 1000);
    } else if (remainingTime === 0) {
      setIsActive(false);
      setIsExtending(true);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, remainingTime, ratePerMinute, duration, initialSlot]);

  const startTimers = (initialDurationMinutes: number, rate: number): void => {
    const initialDurationSeconds = initialDurationMinutes * 60;
    setInitialSlot(initialDurationSeconds);
    setDuration(0);
    setRemainingTime(initialDurationSeconds);
    setCost(0);
    setIsActive(true);
  };

  const stopTimers = (): void => {
    setIsActive(false);
  };

  const extendCall = (additionalMinutes: number): void => {
    setIsExtending(false);
    setRemainingTime(prevRemaining => prevRemaining + (additionalMinutes * 60));
    setIsActive(true);
  };

  const calculateFinalCost = (): number => {
    return parseFloat(cost.toFixed(2));
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return {
    duration,
    cost,
    remainingTime,
    isExtending,
    startTimers,
    stopTimers,
    extendCall,
    calculateFinalCost,
    formatTime
  };
};

export default useCallTimer;
