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
  updateExpertPresence: (expertId: string, status: 'available' | 'busy' | 'away' | 'offline') => Promise<void>;
  trackActivity: (expertId: string) => Promise<void>;
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
          if ((presenceData?.status === 'online' || presenceData?.status === 'available') && timeSinceActivity < 300000) { // 5 minutes
            status = 'online';
            isAvailable = true;
          } else if (presenceData?.status === 'away' || presenceData?.status === 'busy' || (timeSinceActivity >= 300000 && timeSinceActivity < 1800000)) { // 30 minutes
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
            if ((presenceData?.status === 'online' || presenceData?.status === 'available') && timeSinceActivity < 300000) { // 5 minutes
              status = 'online';
              isAvailable = true;
            } else if (presenceData?.status === 'away' || presenceData?.status === 'busy' || (timeSinceActivity >= 300000 && timeSinceActivity < 1800000)) { // 30 minutes
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

  const updateExpertPresence = useCallback(async (
    expertId: string, 
    status: 'available' | 'busy' | 'away' | 'offline'
  ) => {
    try {
      console.log('📝 Updating expert presence:', { expertId, status });
      
      // First, check if expert_presence record exists
      const { data: existingPresence, error: checkError } = await supabase
        .from('expert_presence')
        .select('id')
        .eq('expert_id', expertId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingPresence) {
        // Update existing record
        const { error } = await supabase
          .from('expert_presence')
          .update({
            status,
            last_activity: new Date().toISOString()
          })
          .eq('expert_id', expertId);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('expert_presence')
          .insert({
            expert_id: expertId,
            status,
            last_activity: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Update cache with correct status mapping
      const updatedPresence: ExpertPresence = {
        expertId,
        status: status === 'available' ? 'online' : 
                status === 'busy' ? 'away' :
                status === 'away' ? 'away' : 'offline',
        isAvailable: status === 'available' || status === 'busy' || status === 'away',
        lastActivity: new Date().toISOString(),
        lastUpdate: Date.now()
      };
      
      presenceCache.set(expertId, updatedPresence);
      console.log('✅ Expert presence updated successfully', updatedPresence);
      
    } catch (error) {
      console.error('❌ Error updating expert presence:', error);
      throw error;
    }
  }, []);

  const trackActivity = useCallback(async (expertId: string) => {
    try {
      console.log('⏰ Tracking activity for expert:', expertId);
      
      const { error } = await supabase
        .from('expert_presence')
        .update({
          last_activity: new Date().toISOString()
        })
        .eq('expert_id', expertId);

      if (error) throw error;

      // Update cache
      const cached = presenceCache.get(expertId);
      if (cached) {
        const updatedPresence: ExpertPresence = {
          ...cached,
          lastActivity: new Date().toISOString(),
          lastUpdate: Date.now()
        };
        presenceCache.set(expertId, updatedPresence);
      }
      
      console.log('✅ Activity tracked successfully');
    } catch (error) {
      console.error('❌ Error tracking activity:', error);
      throw error;
    }
  }, []);

  const contextValue: ExpertPresenceContextType = {
    getExpertPresence,
    checkExpertPresence,
    bulkCheckPresence,
    updateExpertPresence,
    trackActivity,
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