
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ExpertProfile } from '@/types/expert';

export const useExpertAuth = () => {
  const auth = useAuth();
  const [currentExpert, setCurrentExpert] = useState<ExpertProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (auth) {
      setCurrentExpert(auth.expertProfile);
      setIsAuthenticated(auth.isAuthenticated && auth.role === 'expert');
      setIsLoading(auth.isLoading);
    }
  }, [auth]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    return auth.login(email, password);
  };
  
  const logout = async (): Promise<boolean> => {
    return auth.logout();
  };
  
  const register = async (data: any): Promise<boolean> => {
    // This would normally register an expert
    console.log("Expert registration data:", data);
    return false;
  };
  
  return {
    currentExpert,
    isAuthenticated,
    isLoading: isLoading,
    loading: isLoading,
    login,
    logout,
    register
  };
};

export default useExpertAuth;
