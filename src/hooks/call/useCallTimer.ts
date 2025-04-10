
import { useState, useEffect, useCallback } from 'react';

export interface UseCallTimerReturn {
  seconds: number;
  minutes: number;
  hours: number;
  resetTimer: () => void;
  formatTime: () => string;
  getTotalSeconds: () => number;
}

export const useCallTimer = (autoStart: boolean = true): UseCallTimerReturn => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setIsRunning(autoStart);
  }, [autoStart]);

  const formatTime = useCallback((): string => {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    
    return `${formattedMinutes}:${formattedSeconds}`;
  }, [hours, minutes, seconds]);

  const getTotalSeconds = useCallback((): number => {
    return hours * 3600 + minutes * 60 + seconds;
  }, [hours, minutes, seconds]);

  return {
    seconds,
    minutes,
    hours,
    resetTimer,
    formatTime,
    getTotalSeconds
  };
};

export default useCallTimer;
