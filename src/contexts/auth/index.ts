
// Consolidated auth exports to reduce import complexity
export { AuthProvider } from './AuthProvider';
export { useAuth } from './AuthContext';
export { EnhancedUnifiedAuthProvider } from './EnhancedUnifiedAuthContext';
export { useEnhancedUnifiedAuth } from './EnhancedUnifiedAuthContext';

// Admin auth (clean system)
export { AdminAuthProvider } from '../AdminAuthClean';
export { useAdminAuthClean } from '../AdminAuthClean';
