
import { useState, useEffect } from 'react';

interface AdminSession {
  id: string;
  role: string;
  timestamp: string;
}

export const useCleanAdminAuth = () => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdminSession = () => {
      try {
        const sessionData = localStorage.getItem('clean_admin_session');
        if (sessionData) {
          const session: AdminSession = JSON.parse(sessionData);
          const now = new Date().getTime();
          const sessionTime = new Date(session.timestamp).getTime();
          const maxAge = 8 * 60 * 60 * 1000; // 8 hours
          
          if (now - sessionTime < maxAge) {
            setAdminSession(session);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('clean_admin_session');
            setAdminSession(null);
            setIsAuthenticated(false);
          }
        } else {
          setAdminSession(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        localStorage.removeItem('clean_admin_session');
        setAdminSession(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem('clean_admin_session');
      setAdminSession(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Admin logout error:', error);
      return false;
    }
  };

  return {
    adminSession,
    isLoading,
    isAuthenticated,
    logout
  };
};
