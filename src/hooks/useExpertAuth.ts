
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { ExpertProfile } from '@/types/expert';

export const useExpertAuth = () => {
  const auth = useAuth();
  const [currentExpert, setCurrentExpert] = useState<ExpertProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (auth.state) {
      setCurrentExpert(auth.state.expertProfile);
      setIsAuthenticated(auth.state.isAuthenticated && auth.state.role === 'expert');
      setIsLoading(auth.state.isLoading);
    }
  }, [auth.state]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    return auth.login(email, password);
  };
  
  const logout = async (): Promise<boolean> => {
    return auth.logout();
  };
  
  const register = async (data: any): Promise<boolean> => {
    // This would normally register an expert
    return false;
  };
  
  return {
    currentExpert,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };
};

export default useExpertAuth;
