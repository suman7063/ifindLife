import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useRealExpertPresence } from './useRealExpertPresence';

/**
 * Hook to automatically sync expert presence when they login/logout
 */
export function useExpertPresenceSync() {
  const { expertProfile, isAuthenticated, role } = useAuth();
  const { updateExpertPresence } = useRealExpertPresence();

  useEffect(() => {
    if (role === 'expert' && expertProfile && isAuthenticated) {
      // Expert logged in - set them as available
      const expertId = expertProfile.id || expertProfile.auth_id;
      if (expertId) {
        console.log('Expert logged in, setting presence to available:', expertId);
        updateExpertPresence(expertId, 'available');
      }
    } else if (role === 'expert' && expertProfile && !isAuthenticated) {
      // Expert logged out - set them as offline
      const expertId = expertProfile.id || expertProfile.auth_id;
      if (expertId) {
        console.log('Expert logged out, setting presence to offline:', expertId);
        updateExpertPresence(expertId, 'offline');
      }
    }
  }, [expertProfile, isAuthenticated, role, updateExpertPresence]);

  // Set offline when component unmounts (page closes)
  useEffect(() => {
    return () => {
      if (role === 'expert' && expertProfile) {
        const expertId = expertProfile.id || expertProfile.auth_id;
        if (expertId) {
          updateExpertPresence(expertId, 'offline');
        }
      }
    };
  }, []);

  return {};
}