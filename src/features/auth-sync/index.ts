
import { useAuthSynchronization as useAuthSync } from '@/hooks/auth-sync';
import { AuthSyncState, SessionType, UseAuthSynchronizationReturn } from './types';

// Re-export hook
export const useAuthSynchronization = useAuthSync;

// Re-export types
export type { AuthSyncState, SessionType, UseAuthSynchronizationReturn };
