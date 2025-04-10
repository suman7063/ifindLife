
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
}

export const useCallTimer = (initialDurationMinutes: number = 0, ratePerMinute: number = 0): UseCallTimerReturn => {
  const [duration, setDuration] = useState<number>(initialDurationMinutes * 60);
  const [remainingTime, setRemainingTime] = useState<number>(initialDurationMinutes * 60);
  const [cost, setCost] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isExtending, setIsExtending] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isActive && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
        setCost(prevCost => prevCost + (ratePerMinute / 60));
      }, 1000);
    } else if (remainingTime === 0) {
      setIsActive(false);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, remainingTime, ratePerMinute]);

  const startTimers = (initialDuration: number, rate: number): void => {
    setDuration(initialDuration * 60);
    setRemainingTime(initialDuration * 60);
    setCost(0);
    setIsActive(true);
  };

  const stopTimers = (): void => {
    setIsActive(false);
  };

  const extendCall = (additionalMinutes: number): void => {
    setIsExtending(true);
    setDuration(prevDuration => prevDuration + (additionalMinutes * 60));
    setRemainingTime(prevRemaining => prevRemaining + (additionalMinutes * 60));
    setTimeout(() => setIsExtending(false), 1000);
  };

  const calculateFinalCost = (): number => {
    return parseFloat((cost).toFixed(2));
  };

  return {
    duration,
    cost,
    remainingTime,
    isExtending,
    startTimers,
    stopTimers,
    extendCall,
    calculateFinalCost
  };
};

export default useCallTimer;
