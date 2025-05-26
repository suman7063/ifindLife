
import { useEffect, useRef } from 'react';

export const useSessionTimeout = (timeout: number, onTimeout: () => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, timeout);
  };
  
  useEffect(() => {
    // Set initial timeout
    resetTimeout();
    
    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, { passive: true });
    });
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeout, onTimeout]);
};
