
// This file is maintained for backward compatibility
// It re-exports everything from the refactored structure
import { UserAuthProvider, UserAuthContext, useUserAuth } from './auth';
import type { User } from '@supabase/supabase-js';
import type { UserAuthContextType, UserProfile, Expert, Review, Report, Course, UserTransaction } from './auth';

export { UserAuthProvider, UserAuthContext, useUserAuth };
export type { User, UserAuthContextType, UserProfile, Expert, Review, Report, Course, UserTransaction };
