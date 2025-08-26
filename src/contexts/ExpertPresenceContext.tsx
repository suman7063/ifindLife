import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExpertPresence {
  expertId: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  acceptingCalls: boolean;
  isAvailable: boolean;
  lastActivity?: string;
  lastUpdate: number;
}

interface ExpertPresenceContextType {
  getExpertPresence: (expertId: string) => ExpertPresence | null;
  checkExpertPresence: (expertId: string) => Promise<ExpertPresence>;
  bulkCheckPresence: (expertIds: string[]) => Promise<void>;
  updateExpertPresence: (expertId: string, status: 'available' | 'busy' | 'away' | 'offline', acceptingCalls?: boolean) => Promise<void>;
  trackActivity: (expertId: string) => Promise<void>;
  isLoading: boolean;
}

const ExpertPresenceContext = createContext<ExpertPresenceContextType | undefined>(undefined);

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache - real-time updates handle most changes
const presenceCache = new Map<string, ExpertPresence>();

export const ExpertPresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const activeRequests = useRef(new Set<string>());

  // Set up real-time subscription to expert_presence changes
  useEffect(() => {
    console.log('🔄 Setting up real-time expert presence subscription');
    
    const channel = supabase
      .channel('expert-presence-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expert_presence'
        },
        (payload: any) => {
          console.log('🔄 Expert presence changed:', payload);
          const presenceData = payload.new || payload.old;
          if (!presenceData) return;
          
          const { expert_id, status, accepting_calls, last_activity } = presenceData;
          
          if (expert_id) {
            // Update cache with new status - keep status fidelity
            const presence: ExpertPresence = {
              expertId: expert_id,
              status: status as 'available' | 'busy' | 'away' | 'offline',
              acceptingCalls: accepting_calls ?? true,
              isAvailable: status === 'available' && (accepting_calls ?? true),
              lastActivity: last_activity,
              lastUpdate: Date.now()
            };
            presenceCache.set(expert_id, presence);
            console.log('✅ Updated presence cache for real-time change:', presence);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up expert presence subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const getExpertPresence = useCallback((expertId: string): ExpertPresence | null => {
    const cached = presenceCache.get(expertId);
    if (cached && (Date.now() - cached.lastUpdate) < CACHE_DURATION) {
      console.log(`📱 Using cached presence for ${expertId}: ${cached.status} (${cached.isAvailable ? 'available' : 'not available'})`);
      return cached;
    }
    if (cached) {
      console.log(`⏰ Stale cache for ${expertId}, age: ${Date.now() - cached.lastUpdate}ms`);
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
      // Get presence data directly - approval check handled elsewhere
      const { data: presenceData } = await supabase
        .from('expert_presence')
        .select('status, accepting_calls, last_activity')
        .eq('expert_id', expertId)
        .single();

      let presence: ExpertPresence;

      if (presenceData) {
        const status = presenceData.status as 'available' | 'busy' | 'away' | 'offline';
        const acceptingCalls = presenceData.accepting_calls ?? true;
        
        presence = {
          expertId,
          status,
          acceptingCalls,
          isAvailable: status === 'available' && acceptingCalls,
          lastActivity: presenceData.last_activity,
          lastUpdate: Date.now()
        };
      } else {
        presence = {
          expertId,
          status: 'offline',
          acceptingCalls: false,
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
        acceptingCalls: false,
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
      const expertsToCheck = expertIds.filter(id => {
        const cached = getExpertPresence(id);
        const isFresh = cached && (Date.now() - cached.lastUpdate) < CACHE_DURATION;
        if (!isFresh) {
          console.log(`🔄 Need fresh data for expert: ${id} (cached: ${!!cached}, fresh: ${isFresh})`);
        }
        return !isFresh;
      });
      
      if (expertsToCheck.length === 0) {
        console.log('✅ All expert presence data is fresh');
        return;
      }

      console.log('📡 Fetching fresh presence data for:', expertsToCheck.length, 'experts');

      // Use the new RPC to get presence for approved experts
      const { data: presenceDataArray } = await supabase
        .rpc('get_approved_expert_presence', { expert_auth_ids: expertsToCheck });

      expertsToCheck.forEach(expertId => {
        const presenceData = presenceDataArray?.find(p => p.expert_id === expertId);
        
        let presence: ExpertPresence;

        if (presenceData) {
          const status = presenceData.status as 'available' | 'busy' | 'away' | 'offline';
          const acceptingCalls = presenceData.accepting_calls ?? true;
          
          presence = {
            expertId,
            status,
            acceptingCalls,
            isAvailable: status === 'available' && acceptingCalls,
            lastActivity: presenceData.last_activity,
            lastUpdate: Date.now()
          };
        } else {
          presence = {
            expertId,
            status: 'offline',
            acceptingCalls: false,
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
    status: 'available' | 'busy' | 'away' | 'offline',
    acceptingCalls?: boolean
  ) => {
    try {
      console.log('📝 Updating expert presence:', { expertId, status, acceptingCalls });
      
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
        const updateData: any = {
          status,
          last_activity: new Date().toISOString()
        };
        
        if (acceptingCalls !== undefined) {
          updateData.accepting_calls = acceptingCalls;
        }

        const { error } = await supabase
          .from('expert_presence')
          .update(updateData)
          .eq('expert_id', expertId);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('expert_presence')
          .insert({
            expert_id: expertId,
            status,
            accepting_calls: acceptingCalls ?? true,
            last_activity: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Force cache update with new status
      const currentAcceptingCalls = acceptingCalls ?? true;
      
      const updatedPresence: ExpertPresence = {
        expertId,
        status: status as 'available' | 'busy' | 'away' | 'offline',
        acceptingCalls: currentAcceptingCalls,
        isAvailable: status === 'available' && currentAcceptingCalls,
        lastActivity: new Date().toISOString(),
        lastUpdate: Date.now()
      };
      
      presenceCache.set(expertId, updatedPresence);
      console.log('✅ Expert presence updated successfully', updatedPresence);
      
      // Broadcast the change to trigger real-time updates across the app
      // The real-time subscription will handle this, but force immediate local update
      if (status === 'available') {
        console.log('🚀 Expert came online, broadcasting presence update');
      }
      
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