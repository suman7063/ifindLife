
// This file is maintained for backward compatibility
// It re-exports everything from the refactored structure
import { UserAuthProvider, UserAuthContext, useUserAuth } from './auth';
import type { User } from '@supabase/supabase-js';
import type { UserAuthContextType } from './auth/types';
import type { UserProfile } from '@/types/supabase';

// Re-export other needed types
export { UserAuthProvider, UserAuthContext, useUserAuth };
export type { User, UserAuthContextType, UserProfile };
