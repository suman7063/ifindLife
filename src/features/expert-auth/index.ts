
import { useState } from 'react';
import { ExpertProfile } from '@/types/expert';

// Temporary mock implementation until real expert auth is implemented
export const useExpertAuth = () => {
  const [currentExpert, setCurrentExpert] = useState<ExpertProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(true);
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login - would connect to Supabase in actual implementation
      console.log("Expert login attempt:", email);
      setLoading(false);
      return false;
    } catch (error) {
      console.error("Expert login error:", error);
      setLoading(false);
      return false;
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      setCurrentExpert(null);
      setIsAuthenticated(false);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Expert logout error:", error);
      setLoading(false);
      return false;
    }
  };
  
  const hasUserAccount = async () => {
    // Would check if the current user has an expert account
    return false;
  };
  
  return {
    currentExpert,
    loading,
    isAuthenticated,
    initialized,
    login,
    logout,
    hasUserAccount
  };
};

// Re-export the ExpertProfile type
export type { ExpertProfile };
