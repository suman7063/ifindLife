
import React from 'react';
import { ExpertProfile } from '@/types/database/unified';

export interface ExpertAuthContextType {
  currentExpert: ExpertProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register?: (data: any) => Promise<boolean>;
  hasUserAccount: boolean;
  updateProfile?: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  initialized?: boolean;
  error: string | null;
}

export const ExpertAuthContext = React.createContext<ExpertAuthContextType>({} as ExpertAuthContextType);
