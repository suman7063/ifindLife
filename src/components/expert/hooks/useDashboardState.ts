
import { useState, useEffect } from 'react';
import { useExpertAuth } from '@/hooks/expert-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useDashboardState = () => {
  const {
    currentExpert, 
    loading, 
    initialized,
    error,
    logout
  } = useExpertAuth();
  
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  
  // Utility function to safely access the expert property
  const expert = currentExpert;
  
  // Clear any cached redirects
  useEffect(() => {
    // Clear local storage redirect data that might be causing issues
    localStorage.removeItem('redirectAfterLogin');
  }, []);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!loading && !currentExpert && !redirectAttempted) {
      console.log('Not authenticated, redirecting to expert login');
      setRedirectAttempted(true);
      toast.error('Please log in to access the expert dashboard');
      navigate('/expert-login');
    }
  }, [currentExpert, loading, redirectAttempted, navigate]);

  return {
    expert, // Make sure this property is available
    currentExpert,
    isLoading: loading,
    isAuthenticated: !!currentExpert,
    error,
    initialized,
    redirectAttempted,
    logout
  };
};

export default useDashboardState;
