
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityContextType {
  sessionTimeout: number;
  isSessionValid: boolean;
  extendSession: () => void;
  forceLogout: () => Promise<void>;
  validateSession: () => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType>({
  sessionTimeout: 0,
  isSessionValid: true,
  extendSession: () => {},
  forceLogout: async () => {},
  validateSession: async () => true,
});

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionTimeout, setSessionTimeout] = useState(0);
  const [isSessionValid, setIsSessionValid] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Session timeout configuration (30 minutes)
  const SESSION_TIMEOUT = 30 * 60 * 1000;

  useEffect(() => {
    // Track user activity
    const trackActivity = () => {
      setLastActivity(Date.now());
    };

    // Add activity listeners
    window.addEventListener('mousedown', trackActivity);
    window.addEventListener('keydown', trackActivity);
    window.addEventListener('scroll', trackActivity);
    window.addEventListener('touchstart', trackActivity);

    return () => {
      window.removeEventListener('mousedown', trackActivity);
      window.removeEventListener('keydown', trackActivity);
      window.removeEventListener('scroll', trackActivity);
      window.removeEventListener('touchstart', trackActivity);
    };
  }, []);

  useEffect(() => {
    // Check session validity periodically
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      const remainingTime = SESSION_TIMEOUT - timeSinceActivity;
      
      setSessionTimeout(Math.max(0, remainingTime));
      
      if (remainingTime <= 0) {
        setIsSessionValid(false);
        forceLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity]);

  const extendSession = () => {
    setLastActivity(Date.now());
    setIsSessionValid(true);
  };

  const forceLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsSessionValid(false);
      console.log('🔒 Security: Session terminated due to inactivity');
    } catch (error) {
      console.error('🔒 Security: Error during forced logout:', error);
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setIsSessionValid(false);
        return false;
      }

      // Check if session is expired
      const now = new Date().getTime();
      const expiresAt = new Date(session.expires_at || 0).getTime();
      
      if (now >= expiresAt) {
        setIsSessionValid(false);
        await forceLogout();
        return false;
      }

      setIsSessionValid(true);
      return true;
    } catch (error) {
      console.error('🔒 Security: Session validation error:', error);
      setIsSessionValid(false);
      return false;
    }
  };

  const value = {
    sessionTimeout,
    isSessionValid,
    extendSession,
    forceLogout,
    validateSession,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
