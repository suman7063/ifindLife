
import { User, Session } from '@supabase/supabase-js';

export interface AuthSession {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export interface AuthUser extends User {
  email: string; 
  phone?: string;
}
