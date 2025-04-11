
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { ExpertProfile } from '@/types/expert';

export interface UseExpertAuthReturn {
  currentExpert: ExpertProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  error?: string | null;
  initialized?: boolean;
  authInitialized: boolean; // Alias for initialized
  user?: User | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  
  // Profile methods
  refreshProfile: () => Promise<void>;
  updateProfile?: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  updateAvailability?: (availabilityData: any) => Promise<boolean>;
  updateServices?: (serviceIds: number[]) => Promise<boolean>;
  
  // User check methods
  hasUserAccount?: () => Promise<boolean>;
}

export const useExpertAuth = (): UseExpertAuthReturn => {
  const [currentExpert, setCurrentExpert] = useState<ExpertProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Mock implementation
  const login = async () => false;
  const logout = async () => false;
  const register = async () => false;
  
  // Add the refreshProfile method
  const refreshProfile = async () => {
    try {
      if (!user) return;
      
      const { data, error: fetchError } = await supabase
        .from('expert_accounts')
        .select('*')
        .eq('auth_id', user.id)
        .single();
        
      if (fetchError) {
        console.error('Error fetching expert profile:', fetchError);
        return;
      }
      
      if (data) {
        setCurrentExpert(data as ExpertProfile);
      }
    } catch (err) {
      console.error('Error refreshing expert profile:', err);
    }
  };

  return {
    currentExpert,
    user,
    isAuthenticated,
    loading,
    isLoading: loading,
    error,
    initialized,
    authInitialized: initialized,
    login,
    logout,
    register,
    refreshProfile,
    hasUserAccount: async () => false
  };
};

export default useExpertAuth;
