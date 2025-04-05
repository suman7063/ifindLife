
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Set the session timeout for 10 minutes (in milliseconds)
const DEFAULT_SESSION_TIMEOUT = 10 * 60 * 1000;

export const useSessionTimeout = (timeoutDuration = DEFAULT_SESSION_TIMEOUT, onTimeout: () => void) => {
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  useEffect(() => {
    // Reset the activity timer on any user interaction
    const resetTimer = () => {
      setLastActivity(Date.now());
      console.log("Activity detected, resetting session timer");
    };
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    
    // Check session timeout every minute
    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastActivity;
      console.log(`Time since last activity: ${Math.round(timeElapsed / 1000)} seconds`);
      
      if (timeElapsed > timeoutDuration) {
        // Session timed out, log out
        console.log("Session timeout reached, logging out");
        toast.warning('Your session has expired due to inactivity.');
        onTimeout();
      }
    }, 60000); // Check every minute
    
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearInterval(interval);
      if (sessionTimer) clearTimeout(sessionTimer);
    };
  }, [lastActivity, timeoutDuration, onTimeout, sessionTimer]);
  
  return { lastActivity };
};
