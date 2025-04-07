
import { UserProfile } from '@/types/supabase';
import { ExpertProfile } from '../types';

export interface StatusMessage {
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
}

export interface UseLoginPageStatusReturn {
  statusMessage: StatusMessage | null;
  setStatusMessage: React.Dispatch<React.SetStateAction<StatusMessage | null>>;
}

export interface UseExpertLoginPageReturn {
  isLoggingIn: boolean;
  loginError: string | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile | null;
  statusMessage: StatusMessage | null;
  expert: ExpertProfile | null;
  loading: boolean;
  initialized: boolean;
  isCheckingUser: boolean;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  redirectAttempted: boolean;
}
