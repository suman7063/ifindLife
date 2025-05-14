
import { createContext, useContext } from 'react';
import { UserProfile, ExpertProfile } from '@/types/database/unified';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile | null;
  expertProfile: ExpertProfile | null;
  role: 'user' | 'expert' | 'admin' | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<UserProfile>) => Promise<boolean>;
  registerExpert: (email: string, password: string, expertData: Partial<ExpertProfile>) => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateExpertProfile: (data: Partial<ExpertProfile>) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<string>;
  updateExpertProfilePicture: (file: File) => Promise<string>;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  profile: null,
  expertProfile: null,
  role: null,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  registerExpert: async () => false,
  updateProfile: async () => false,
  updateExpertProfile: async () => false,
  updateProfilePicture: async () => '',
  updateExpertProfilePicture: async () => ''
});

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
