import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExpertPresence {
  expertId: string;
  status: 'online' | 'away' | 'offline';
  isAvailable: boolean;
  lastActivity?: string;
  lastUpdate: number;
}

interface ExpertPresenceContextType {
  getExpertPresence: (expertId: string) => ExpertPresence | null;
  checkExpertPresence: (expertId: string) => Promise<ExpertPresence>;
  bulkCheckPresence: (expertIds: string[]) => Promise<void>;
  isLoading: boolean;
}

const ExpertPresenceContext = createContext<ExpertPresenceContextType | undefined>(undefined);

const CACHE_DURATION = 60000; // 1 minute cache
const presenceCache = new Map<string, ExpertPresence>();

export const ExpertPresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const activeRequests = useRef(new Set<string>());

  const getExpertPresence = useCallback((expertId: string): ExpertPresence | null => {
    const cached = presenceCache.get(expertId);
    if (cached && (Date.now() - cached.lastUpdate) < CACHE_DURATION) {
      return cached;
    }
    return null;
  }, []);

  const checkExpertPresence = useCallback(async (expertId: string): Promise<ExpertPresence> => {
    // Check cache first
    const cached = getExpertPresence(expertId);
    if (cached) {
      return cached;
    }

    // Prevent duplicate requests
    if (activeRequests.current.has(expertId)) {
      // Wait for existing request to complete
      return new Promise((resolve) => {
        const checkForResult = () => {
          const result = getExpertPresence(expertId);
          if (result) {
            resolve(result);
          } else {
            setTimeout(checkForResult, 100);
          }
        };
        checkForResult();
      });
    }

    activeRequests.current.add(expertId);
    setIsLoading(true);

    try {
      // Get expert account and presence data
      const [expertResponse, presenceResponse] = await Promise.all([
        supabase
          .from('expert_accounts')
          .select('auth_id, status')
          .eq('auth_id', expertId)
          .single(),
        supabase
          .from('expert_presence')
          .select('status, last_activity')
          .eq('expert_id', expertId)
          .single()
      ]);

      const expertData = expertResponse.data;
      const presenceData = presenceResponse.data;

      let presence: ExpertPresence;

      if (expertData) {
        const now = new Date();
        const lastActivity = presenceData?.last_activity ? new Date(presenceData.last_activity) : null;
        const timeSinceActivity = lastActivity ? now.getTime() - lastActivity.getTime() : Infinity;
        
        // Determine status based on last activity and expert account status
        let status: 'online' | 'away' | 'offline' = 'offline';
        let isAvailable = false;

        if (expertData.status === 'approved') {
          if (presenceData?.status === 'online' && timeSinceActivity < 300000) { // 5 minutes
            status = 'online';
            isAvailable = true;
          } else if (presenceData?.status === 'away' || (timeSinceActivity >= 300000 && timeSinceActivity < 1800000)) { // 30 minutes
            status = 'away';
            isAvailable = true; // Away but still available
          }
        }

        presence = {
          expertId,
          status,
          isAvailable,
          lastActivity: presenceData?.last_activity,
          lastUpdate: Date.now()
        };
      } else {
        presence = {
          expertId,
          status: 'offline',
          isAvailable: false,
          lastUpdate: Date.now()
        };
      }

      presenceCache.set(expertId, presence);
      return presence;
    } catch (error) {
      console.error('Error checking expert presence:', error);
      const fallbackPresence: ExpertPresence = {
        expertId,
        status: 'offline',
        isAvailable: false,
        lastUpdate: Date.now()
      };
      presenceCache.set(expertId, fallbackPresence);
      return fallbackPresence;
    } finally {
      activeRequests.current.delete(expertId);
      setIsLoading(false);
    }
  }, [getExpertPresence]);

  const bulkCheckPresence = useCallback(async (expertIds: string[]) => {
    console.log('🔍 Checking presence for experts:', expertIds.length);
    setIsLoading(true);
    
    try {
      // Filter out experts we already have fresh data for
      const expertsToCheck = expertIds.filter(id => !getExpertPresence(id));
      
      if (expertsToCheck.length === 0) {
        console.log('✅ All expert presence data is cached');
        return;
      }

      console.log('📡 Fetching fresh presence data for:', expertsToCheck.length, 'experts');

      // Batch query expert accounts and presence data
      const [expertsResponse, presenceResponse] = await Promise.all([
        supabase
          .from('expert_accounts')
          .select('auth_id, status')
          .in('auth_id', expertsToCheck),
        supabase
          .from('expert_presence')
          .select('expert_id, status, last_activity')
          .in('expert_id', expertsToCheck)
      ]);

      const expertsData = expertsResponse.data || [];
      const presenceDataArray = presenceResponse.data || [];

      const now = new Date();

      expertsToCheck.forEach(expertId => {
        const expertData = expertsData.find(e => e.auth_id === expertId);
        const presenceData = presenceDataArray.find(p => p.expert_id === expertId);
        
        let presence: ExpertPresence;

        if (expertData) {
          const lastActivity = presenceData?.last_activity ? new Date(presenceData.last_activity) : null;
          const timeSinceActivity = lastActivity ? now.getTime() - lastActivity.getTime() : Infinity;
          
          let status: 'online' | 'away' | 'offline' = 'offline';
          let isAvailable = false;

          if (expertData.status === 'approved') {
            if (presenceData?.status === 'online' && timeSinceActivity < 300000) { // 5 minutes
              status = 'online';
              isAvailable = true;
            } else if (presenceData?.status === 'away' || (timeSinceActivity >= 300000 && timeSinceActivity < 1800000)) { // 30 minutes
              status = 'away';
              isAvailable = true;
            }
          }

          presence = {
            expertId,
            status,
            isAvailable,
            lastActivity: presenceData?.last_activity,
            lastUpdate: Date.now()
          };
        } else {
          presence = {
            expertId,
            status: 'offline',
            isAvailable: false,
            lastUpdate: Date.now()
          };
        }

        presenceCache.set(expertId, presence);
      });

    } catch (error) {
      console.error('Error bulk checking expert presence:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getExpertPresence]);

  const contextValue: ExpertPresenceContextType = {
    getExpertPresence,
    checkExpertPresence,
    bulkCheckPresence,
    isLoading
  };

  return (
    <ExpertPresenceContext.Provider value={contextValue}>
      {children}
    </ExpertPresenceContext.Provider>
  );
};

export const useExpertPresence = () => {
  const context = useContext(ExpertPresenceContext);
  if (!context) {
    throw new Error('useExpertPresence must be used within an ExpertPresenceProvider');
  }
  return context;
};