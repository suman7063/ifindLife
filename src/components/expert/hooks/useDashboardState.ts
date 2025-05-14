
import { useState, useEffect } from 'react';
import { useExpertAuth } from '@/hooks/expert-auth/useExpertAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useDashboardState = () => {
  const { expert, isAuthenticated, loading, logout } = useExpertAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const navigate = useNavigate();

  // Rename expert to currentExpert for backwards compatibility
  const currentExpert = expert;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/expert-login');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const success = await logout();
      
      if (success) {
        toast.success('Successfully logged out');
        navigate('/');
      } else {
        toast.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('An error occurred while logging out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    currentExpert, // Add this for backward compatibility
    expert,
    loading,
    isAuthenticated,
    activeTab,
    isLoggingOut,
    handleTabChange,
    handleLogout
  };
};
