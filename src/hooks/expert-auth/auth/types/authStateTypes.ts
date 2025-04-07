
import { User } from '@supabase/supabase-js';
import { ExpertProfile } from '../../types';

export interface ExpertAuthState {
  currentExpert: ExpertProfile | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
}

export interface UseExpertInitializationReturn {
  authState: ExpertAuthState;
  setAuthState: React.Dispatch<React.SetStateAction<ExpertAuthState>>;
}
