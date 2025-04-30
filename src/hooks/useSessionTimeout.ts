
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Set the session timeout for 30 minutes (in milliseconds)
const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000;
// Warning before timeout (5 minutes before)
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000;

export const useSessionTimeout = (timeoutDuration = DEFAULT_SESSION_TIMEOUT, onTimeout: () => void) => {
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showingWarning, setShowingWarning] = useState(false);
  
  // Reset all timers and activity timestamp
  const resetActivity = () => {
    setLastActivity(Date.now());
    setShowingWarning(false);
    
    // If there's an active warning, dismiss it
    if (showingWarning) {
      toast.dismiss('session-timeout-warning');
    }
  };
  
  useEffect(() => {
    // Reset the activity timer on any user interaction
    const resetTimer = () => {
      resetActivity();
    };
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('scroll', resetTimer);
    
    // Check session timeout every minute
    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastActivity;
      console.log(`Time since last activity: ${Math.round(timeElapsed / 1000)} seconds`);
      
      // Show warning before timeout
      if (timeElapsed > (timeoutDuration - WARNING_BEFORE_TIMEOUT) && !showingWarning) {
        setShowingWarning(true);
        
        toast.warning(
          'Session about to expire', 
          {
            description: 'Your session will expire soon due to inactivity',
            duration: Infinity, // Don't auto-dismiss warning
            id: 'session-timeout-warning', // Unique ID to reference this toast
            action: {
              label: 'Stay logged in',
              onClick: () => resetActivity(),
            },
          }
        );
      }
      
      // Actual timeout check
      if (timeElapsed > timeoutDuration) {
        console.log("Session timeout reached, logging out");
        toast.dismiss('session-timeout-warning');
        toast.error('Session expired', {
          description: 'Your session has expired due to inactivity'
        });
        onTimeout();
      }
    }, 60000); // Check every minute
    
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      
      clearInterval(interval);
      if (sessionTimer) clearTimeout(sessionTimer);
      if (warningTimer) clearTimeout(warningTimer);
      
      // Clean up any lingering toasts
      toast.dismiss('session-timeout-warning');
    };
  }, [lastActivity, timeoutDuration, onTimeout, sessionTimer, showingWarning, warningTimer]);
  
  return { lastActivity, resetActivity };
};
