import { useEffect } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useRealExpertPresence } from './useRealExpertPresence';
import { toast } from 'sonner';

/**
 * Integrated hook that manages expert presence based on authentication state
 * When an expert logs in/out, their presence is automatically updated
 */
export function useIntegratedExpertPresence() {
  const { expert, isAuthenticated, userType } = useSimpleAuth();
  const { updateExpertPresence } = useRealExpertPresence();

  useEffect(() => {
    if (userType === 'expert' && expert && isAuthenticated) {
      // Expert logged in - set them as available
      const expertAuthId = expert.auth_id || expert.id;
      if (expertAuthId) {
        console.log('🟢 Expert logged in, setting presence to available:', {
          expertAuthId,
          expertName: expert.name,
          status: expert.status
        });
        
        // Only set available if expert is approved
        const status = expert.status === 'approved' ? 'available' : 'offline';
        updateExpertPresence(expertAuthId, status);
        
        if (expert.status === 'approved') {
          toast.success(`Welcome back, ${expert.name}! You are now online and available.`);
        }
      }
    } else if (userType === 'expert' && expert && !isAuthenticated) {
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

  // Listen for page visibility changes to update presence
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (userType === 'expert' && expert && isAuthenticated) {
        const expertAuthId = expert.auth_id || expert.id;
        if (expertAuthId) {
          const status = document.hidden ? 'away' : 'available';
          console.log('👁️ Visibility changed, updating presence:', { expertAuthId, status });
          updateExpertPresence(expertAuthId, status);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [expert, isAuthenticated, userType, updateExpertPresence]);

  return {
    expert,
    isAuthenticated,
    userType,
    isExpertOnline: Boolean(expert && isAuthenticated && expert.status === 'approved')
  };
}