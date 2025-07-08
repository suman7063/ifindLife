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
      const expertId = expert.id || expert.auth_id;
      if (expertId) {
        console.log('🟢 Expert logged in, setting presence to available:', {
          expertId,
          expertName: expert.name,
          status: expert.status
        });
        
        // Only set available if expert is approved
        const status = expert.status === 'approved' ? 'available' : 'offline';
        updateExpertPresence(expertId, status);
        
        if (expert.status === 'approved') {
          toast.success(`Welcome back, ${expert.name}! You are now online and available.`);
        }
      }
    } else if (userType === 'expert' && expert && !isAuthenticated) {
      // Expert logged out - set them as offline
      const expertId = expert.id || expert.auth_id;
      if (expertId) {
        console.log('🔴 Expert logged out, setting presence to offline:', expertId);
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
          console.log('🔴 Page unload, setting expert offline:', expertId);
          updateExpertPresence(expertId, 'offline');
        }
      }
    };
  }, []);

  // Listen for page visibility changes to update presence
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (userType === 'expert' && expert && isAuthenticated) {
        const expertId = expert.id || expert.auth_id;
        if (expertId) {
          const status = document.hidden ? 'away' : 'available';
          console.log('👁️ Visibility changed, updating presence:', { expertId, status });
          updateExpertPresence(expertId, status);
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