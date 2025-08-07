// Unified auth exports - single source of truth
export { useUnifiedAuth as useAuth } from './UnifiedAuthContext';
export type { UnifiedAuthContextType as AuthContextType } from './UnifiedAuthContext';

// Legacy exports for backward compatibility
export { useSimpleAuth } from '@/contexts/SimpleAuthContext';
export type { SimpleAuthContextType } from '@/contexts/SimpleAuthContext';