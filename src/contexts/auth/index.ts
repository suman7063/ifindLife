
// Re-export the unified auth context
export { useAuth, UnifiedAuthProvider as AuthProvider } from './UnifiedAuthContext';
export { AuthContext } from './AuthContext';

// Re-export types for backward compatibility
export type { 
  UnifiedAuthContextType as AuthContextType
} from './UnifiedAuthContext';

// Note: Legacy exports removed - using simplified unified auth
