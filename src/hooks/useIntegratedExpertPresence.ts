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
        console.log('🔴 Expert logged out, would set offline:', expertAuthId);
        // Temporarily disabled to prevent network errors during authentication
        // updateExpertPresence(expertAuthId, 'offline');
      }
    }
  }, [expert, isAuthenticated, userType, updateExpertPresence]);

  // Set offline when the last tab closes - use page visibility and localStorage to coordinate
  useEffect(() => {
    if (userType !== 'expert' || !expert) return;
    
    const expertAuthId = expert.auth_id || expert.id;
    if (!expertAuthId) return;

    // Track this tab
    const tabId = Date.now().toString();
    const storageKey = `expert_tabs_${expertAuthId}`;
    
    // Add this tab to the list
    const updateTabsList = () => {
      const existingTabs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedTabs = [...existingTabs, tabId];
      localStorage.setItem(storageKey, JSON.stringify(updatedTabs));
    };
    
    updateTabsList();
    
    const handleBeforeUnload = () => {
      const existingTabs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const remainingTabs = existingTabs.filter((id: string) => id !== tabId);
      
      if (remainingTabs.length === 0) {
        // This was the last tab, set expert offline
        console.log('🔴 Last tab closing, setting expert offline:', expertAuthId);
        // Temporarily disabled to prevent network errors during authentication
        // updateExpertPresence(expertAuthId, 'offline');
        localStorage.removeItem(storageKey);
      } else {
        // Other tabs still open, just remove this tab
        localStorage.setItem(storageKey, JSON.stringify(remainingTabs));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Clean up tab tracking when component unmounts normally
      const existingTabs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const remainingTabs = existingTabs.filter((id: string) => id !== tabId);
      if (remainingTabs.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(remainingTabs));
      } else {
        localStorage.removeItem(storageKey);
      }
    };
  }, [expert, userType, updateExpertPresence]);

  // REMOVED: Automatic status changes on page visibility
  // Experts control their own status explicitly through MasterStatusControl

  return {
    expert,
    isAuthenticated,
    userType,
    isExpertOnline: Boolean(expert && isAuthenticated && expert.status === 'approved')
  };
}