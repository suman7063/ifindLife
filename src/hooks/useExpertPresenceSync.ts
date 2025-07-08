import { useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRealExpertPresence } from './useRealExpertPresence';

/**
 * Hook to automatically sync expert presence when they login/logout
 * DEPRECATED: Use useIntegratedExpertPresence instead
 */
export function useExpertPresenceSync() {
  const { expert, isAuthenticated, userType } = useSimpleAuth();
  const { updateExpertPresence } = useRealExpertPresence();

  useEffect(() => {
    if (userType === 'expert' && expert && isAuthenticated) {
      // Expert logged in - set them as available
      const expertId = expert.id || expert.auth_id;
      if (expertId) {
        console.log('Expert logged in, setting presence to available:', expertId);
        // Only set available if expert is approved
        const status = expert.status === 'approved' ? 'available' : 'offline';
        updateExpertPresence(expertId, status);
      }
    } else if (userType === 'expert' && expert && !isAuthenticated) {
      // Expert logged out - set them as offline
      const expertId = expert.id || expert.auth_id;
      if (expertId) {
        console.log('Expert logged out, setting presence to offline:', expertId);
        updateExpertPresence(expertId, 'offline');
      }
    }
  }, [expert, isAuthenticated, userType, updateExpertPresence]);

  // Set offline when component unmounts (page closes)
  useEffect(() => {
    return () => {
      if (userType === 'expert' && expert) {
        const expertId = expert.id || expert.auth_id;
        if (expertId) {
          updateExpertPresence(expertId, 'offline');
        }
      }
    };
  }, []);

  return {};
}