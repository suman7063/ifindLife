
// This file is maintained for backward compatibility
// It re-exports everything from the refactored structure
import { UserAuthProvider, UserAuthContext, useUserAuth } from './auth';
import { User } from '@supabase/supabase-js';
import type { UserAuthContextType, UserProfile, Expert, Review, Report, Course, UserTransaction } from './auth';

export { UserAuthProvider, UserAuthContext, useUserAuth, User };
export type { UserAuthContextType, UserProfile, Expert, Review, Report, Course, UserTransaction };
