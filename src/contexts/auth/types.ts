// Import the UserProfile from the supabase/user module
import { UserProfile } from '@/types/supabase/user';
export { UserProfile };

export type UserRole = 'user' | 'expert' | 'admin';

export interface AuthUser {
  id: string;
  email: string | null;
  role: UserRole | null;
  profile?: UserProfile | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearSession: () => void;
}
