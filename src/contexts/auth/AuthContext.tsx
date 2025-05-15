
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export type SessionType = 'none' | 'user' | 'expert' | 'dual';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  userProfile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  login: (email: string, password: string, asExpert?: boolean) => Promise<boolean>;
  register: (email: string, password: string, userData: any, referralCode?: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  registerExpert: (email: string, password: string, expertData: any) => Promise<boolean>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  refreshExpertProfile: () => Promise<ExpertProfile | null>;
  refreshProfile: () => Promise<void>; // For backward compatibility
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (updates: Partial<ExpertProfile>) => Promise<boolean>;
  addExpertService: (serviceId: number, price: number) => Promise<boolean>;
  removeExpertService: (serviceId: number) => Promise<boolean>;
  role: 'user' | 'expert' | null;
  sessionType: SessionType;
  profile: UserProfile | null; // Added for backward compatibility
  walletBalance: number; // Added for backward compatibility
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>; // Added for backward compatibility
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
