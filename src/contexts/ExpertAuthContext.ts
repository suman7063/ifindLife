
import React, { createContext } from 'react';
import { ExpertProfile } from '@/hooks/expert-auth/types';

// Define the context type
export interface ExpertAuthContextType {
  currentExpert: ExpertProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  updateProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  hasUserAccount: () => Promise<boolean>;
}

// Create the context with default values
export const ExpertAuthContext = createContext<ExpertAuthContextType>({
  currentExpert: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => false,
  logout: async () => false,
  register: async () => false,
  updateProfile: async () => false,
  hasUserAccount: async () => false
});
