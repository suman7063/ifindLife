import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';

export const useAuthLogoutEffects = (
  isAuthenticated: boolean, 
  fullLogout: () => Promise<void>
) => {
  const navigate = useNavigate();
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasDualSessions, setHasDualSessions] = useState(false);
  const { logout: userLogout, user } = useUserAuth();

  useEffect(() => {
    const checkDualSessions = async () => {
      setIsSynchronizing(true);
      try {
        // Check if the user has a session and a user profile
        const hasUserProfile = !!user;

        // Check if the expert is authenticated by checking local storage
        const expertAuthData = localStorage.getItem('expertAuth');
        const isExpertAuthenticated = !!expertAuthData;

        setHasDualSessions(hasUserProfile && isExpertAuthenticated);
      } catch (error) {
        console.error('Error checking dual sessions:', error);
      } finally {
        setIsSynchronizing(false);
      }
    };

    checkDualSessions();
  }, [user]);

  const handleUserLogout = async () => {
    setIsLoggingOut(true);
    try {
      await userLogout();
      navigate('/');
    } catch (error) {
      console.error('User logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fullLogout(); // Fixed: No arguments passed here
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
    
  return () => {
      // Cleanup code...
  };
  }, [isAuthenticated, fullLogout, navigate]);
  
  return {
    isSynchronizing,
    isLoggingOut,
    hasDualSessions,
    handleUserLogout,
    handleFullLogout: handleLogout
  };
};

export default useAuthLogoutEffects;
