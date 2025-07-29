import { useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { toast } from 'sonner';

/**
 * Integrated hook that manages expert presence based on authentication state
 * When an expert logs in/out, their presence is automatically updated
 */
export function useIntegratedExpertPresence() {
  const { expert, isAuthenticated, userType } = useSimpleAuth();
  const { checkExpertPresence, updateExpertPresence } = useExpertPresence();

  // REMOVED: Automatic status setting on login
  // Experts now must explicitly set their status using MasterStatusControl
  useEffect(() => {
    if (userType === 'expert' && expert && !isAuthenticated) {
      // Expert logged out - set them as offline
      const expertAuthId = expert.auth_id || expert.id;
      if (expertAuthId) {
        console.log('🔴 Expert logged out, setting presence to offline:', expertAuthId);
        updateExpertPresence(expertAuthId, 'offline');
      }
    }
  }, [expert, isAuthenticated, userType, updateExpertPresence]);

  // Set offline when component unmounts (page closes)
  useEffect(() => {
    return () => {
      if (userType === 'expert' && expert) {
        const expertAuthId = expert.auth_id || expert.id;
        if (expertAuthId) {
          console.log('🔴 Page unload, setting expert offline:', expertAuthId);
          updateExpertPresence(expertAuthId, 'offline');
        }
      }
    };
  }, []);

  // REMOVED: Automatic status changes on page visibility
  // Experts control their own status explicitly through MasterStatusControl

  return {
    expert,
    isAuthenticated,
    userType,
    isExpertOnline: Boolean(expert && isAuthenticated && expert.status === 'approved')
  };
}