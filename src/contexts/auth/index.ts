
// Re-export the components from the user auth context
export { AuthContext, useAuth } from './AuthContext';
export { AuthProvider } from './AuthProvider';
export { UserAuthProvider } from './UserAuthProvider';

// Re-export the types
export type { 
  AuthContextType, 
  UserRole, 
  AuthState, 
  AuthUser,
  SessionType
} from './types';

// Re-export hooks
export * from './hooks/useAuthState';
export * from './hooks/useAuthActions';
export * from './hooks/useAuthFunctions';
