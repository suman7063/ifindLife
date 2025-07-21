import { useState, useCallback } from 'react';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';

interface ExpertStatus {
  status: 'online' | 'away' | 'offline';
  isAvailable: boolean;
  lastActivity?: string;
}

export const useLazyExpertPresence = () => {
  const { getExpertPresence, checkExpertPresence } = useExpertPresence();
  const [loadingExperts, setLoadingExperts] = useState<Set<string>>(new Set());

  const getExpertStatus = useCallback((expertId: string): ExpertStatus => {
    const presence = getExpertPresence(expertId);
    return {
      status: presence?.status || 'offline',
      isAvailable: presence?.isAvailable || false,
      lastActivity: presence?.lastActivity
    };
  }, [getExpertPresence]);

  const checkExpertOnInteraction = useCallback(async (expertId: string): Promise<ExpertStatus> => {
    // Show loading state for this specific expert
    setLoadingExperts(prev => new Set(prev).add(expertId));
    
    try {
      console.log('👆 User interacting with expert, checking presence:', expertId);
      const presence = await checkExpertPresence(expertId);
      
      return {
        status: presence.status,
        isAvailable: presence.isAvailable,
        lastActivity: presence.lastActivity
      };
    } finally {
      setLoadingExperts(prev => {
        const newSet = new Set(prev);
        newSet.delete(expertId);
        return newSet;
      });
    }
  }, [checkExpertPresence]);

  const isExpertLoading = useCallback((expertId: string): boolean => {
    return loadingExperts.has(expertId);
  }, [loadingExperts]);

  return {
    getExpertStatus,
    checkExpertOnInteraction,
    isExpertLoading
  };
};