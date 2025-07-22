
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface LazyPresenceStatus {
  status: 'online' | 'away' | 'offline';
  isAvailable: boolean;
  lastActivity: string;
}

export const useLazyExpertPresence = () => {
  const [presenceCache, setPresenceCache] = useState<Record<string, LazyPresenceStatus>>({});
  const [loadingExperts, setLoadingExperts] = useState<Set<string>>(new Set());
  const lastChecked = useRef<Record<string, number>>({});

  const getExpertStatus = useCallback((expertId: string): LazyPresenceStatus => {
    // Return cached data immediately
    return presenceCache[expertId] || {
      status: 'offline',
      isAvailable: false,
      lastActivity: ''
    };
  }, [presenceCache]);

  const checkExpertOnInteraction = useCallback(async (expertId: string) => {
    const now = Date.now();
    const lastCheck = lastChecked.current[expertId] || 0;
    
    // Only check if it's been more than 30 seconds since last check
    if (now - lastCheck < 30000) {
      console.log('🔄 Using cached presence data for:', expertId);
      return;
    }

    if (loadingExperts.has(expertId)) {
      console.log('⏳ Already checking presence for:', expertId);
      return;
    }

    setLoadingExperts(prev => new Set(prev).add(expertId));
    console.log('🔍 Checking presence on interaction for:', expertId);

    try {
      const { data, error } = await supabase
        .from('expert_presence')
        .select('status, last_activity')
        .eq('expert_id', expertId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const status: LazyPresenceStatus = {
        status: data?.status === 'available' ? 'online' : 
               data?.status === 'away' ? 'away' : 'offline',
        isAvailable: data?.status === 'available',
        lastActivity: data?.last_activity || ''
      };

      setPresenceCache(prev => ({
        ...prev,
        [expertId]: status
      }));

      lastChecked.current[expertId] = now;
      console.log('✅ Updated presence for:', expertId, status);
    } catch (error) {
      console.error('❌ Error checking expert presence:', error);
      // Set as offline on error
      setPresenceCache(prev => ({
        ...prev,
        [expertId]: {
          status: 'offline',
          isAvailable: false,
          lastActivity: ''
        }
      }));
    } finally {
      setLoadingExperts(prev => {
        const newSet = new Set(prev);
        newSet.delete(expertId);
        return newSet;
      });
    }
  }, [loadingExperts]);

  const isExpertLoading = useCallback((expertId: string): boolean => {
    return loadingExperts.has(expertId);
  }, [loadingExperts]);

  return {
    getExpertStatus,
    checkExpertOnInteraction,
    isExpertLoading
  };
};
