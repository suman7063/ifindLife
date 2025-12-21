import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useSyncExternalStore } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ExpertPresence {
  expertId: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  acceptingCalls: boolean;
  isAvailable: boolean;
  lastActivity?: string;
  lastUpdate: number;
  previousStatus?: 'available' | 'busy' | 'away' | 'offline' | null;
}

interface ExpertPresenceContextType {
  getExpertPresence: (expertId: string) => ExpertPresence | null;
  checkExpertPresence: (expertId: string) => Promise<ExpertPresence>;
  bulkCheckPresence: (expertIds: string[]) => Promise<void>;
  updateExpertPresence: (expertId: string, status: 'available' | 'busy' | 'away' | 'offline', acceptingCalls?: boolean, previousStatus?: 'available' | 'busy' | 'away' | 'offline' | null) => Promise<void>;
  trackActivity: (expertId: string) => Promise<void>;
  isLoading: boolean;
  version: number;
}

const ExpertPresenceContext = createContext<ExpertPresenceContextType | undefined>(undefined);

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache - real-time updates handle most changes
const presenceCache = new Map<string, ExpertPresence>();

// Tiny store to signal presence cache changes to React via useSyncExternalStore
let changeCounter = 0;
const listeners = new Set<() => void>();
const presenceStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => changeCounter,
};
const emitPresenceChange = () => {
  changeCounter += 1;
  listeners.forEach((l) => l());
};

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
            emitPresenceChange();
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
      // Only log occasionally to reduce console spam
      if (Math.random() < 0.01) { // Log 1% of the time
        console.log(`📱 Using cached presence for ${expertId}: ${cached.status} (${cached.isAvailable ? 'available' : 'not available'})`);
      }
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
        .select('status, accepting_calls, last_activity, previous_status')
        .eq('expert_id', expertId)
        .maybeSingle();

      const status = (presenceData?.status as 'available' | 'busy' | 'away' | 'offline') ?? 'offline';
      const acceptingCalls = presenceData?.accepting_calls ?? false;
      const previousStatus = presenceData?.previous_status as 'available' | 'busy' | 'away' | 'offline' | null | undefined;

      const presence: ExpertPresence = {
        expertId,
        status,
        acceptingCalls,
        isAvailable: status === 'available' && acceptingCalls,
        lastActivity: presenceData?.last_activity,
        lastUpdate: Date.now(),
        previousStatus: previousStatus ?? null
      };

      presenceCache.set(expertId, presence);
      emitPresenceChange();
      return presence;
    } finally {
      activeRequests.current.delete(expertId);
      setIsLoading(false);
    }
  }, [getExpertPresence]);

  const bulkCheckPresence = useCallback(async (expertIds: string[]) => {
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
        setIsLoading(false);
        return;
      }

      console.log('📡 Fetching fresh presence data for:', expertsToCheck.length, 'experts');

      // Validate UUIDs before calling RPC
      const validExpertIds = expertsToCheck.filter(id => {
        // Basic UUID validation (8-4-4-4-12 format)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
      });

      if (validExpertIds.length === 0) {
        console.warn('⚠️ No valid UUIDs to check presence for');
        setIsLoading(false);
        return;
      }

      // Use the new RPC to get presence for approved experts
      const { data: presenceDataArray, error: rpcError } = await supabase
        .rpc('get_approved_expert_presence', { expert_auth_ids: validExpertIds });

      if (rpcError) {
        console.error('❌ Error fetching expert presence:', rpcError);
        setIsLoading(false);
        return;
      }

      validExpertIds.forEach(expertId => {
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
      emitPresenceChange();

    } catch (error) {
      console.error('Error bulk checking expert presence:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getExpertPresence]);

  const updateExpertPresence = useCallback(async (
    expertId: string, 
    status: 'available' | 'busy' | 'away' | 'offline',
    acceptingCalls?: boolean,
    previousStatus?: 'available' | 'busy' | 'away' | 'offline' | null
  ) => {
    try {
      console.log('📝 Updating expert presence:', { expertId, status, acceptingCalls, previousStatus });
      console.log('🔍 Expert ID type:', typeof expertId, 'Value:', expertId);
      
      // Validate expertId
      if (!expertId || typeof expertId !== 'string') {
        throw new Error('Invalid expert ID provided');
      }
      
      // Normalize accepting calls: offline must always be false
      const normalizedAccepting = status === 'offline' ? false : (acceptingCalls ?? true);
      
      // First, check if expert_presence record exists
      const { data: existingPresence, error: checkError } = await supabase
        .from('expert_presence')
        .select('id, expert_id')
        .eq('expert_id', expertId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing presence:', checkError);
        throw checkError;
      }

      if (existingPresence) {
        // Update existing record
        const updateData: any = {
          status,
          accepting_calls: normalizedAccepting,
          last_activity: new Date().toISOString()
        };

        // Only update previous_status if explicitly provided (null clears it)
        if (previousStatus !== undefined) {
          updateData.previous_status = previousStatus;
        }

        const { error } = await supabase
          .from('expert_presence')
          .update(updateData)
          .eq('expert_id', expertId);

        if (error) throw error;
      } else {
        // Create new record
        const insertData: any = {
          expert_id: expertId,
          status,
          accepting_calls: normalizedAccepting,
          last_activity: new Date().toISOString()
        };

        // Only set previous_status if provided
        if (previousStatus !== undefined && previousStatus !== null) {
          insertData.previous_status = previousStatus;
        }

        const { error } = await supabase
          .from('expert_presence')
          .insert(insertData);

        if (error) throw error;
      }

      // Force cache update with new status
      const updatedPresence: ExpertPresence = {
        expertId,
        status: status as 'available' | 'busy' | 'away' | 'offline',
        acceptingCalls: normalizedAccepting,
        isAvailable: status === 'available' && normalizedAccepting,
        lastActivity: new Date().toISOString(),
        lastUpdate: Date.now()
      };
      
      presenceCache.set(expertId, updatedPresence);
      emitPresenceChange();
      console.log('✅ Expert presence updated successfully', updatedPresence);
      
    } catch (error) {
      console.error('❌ Error updating expert presence:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('🌐 Network error - check internet connection and Supabase status');
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      } else if (error instanceof Error) {
        console.error('❌ Database error:', error.message);
        throw new Error(`Failed to update presence: ${error.message}`);
      } else {
        console.error('❌ Unknown error:', error);
        throw new Error('An unexpected error occurred while updating presence');
      }
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
        emitPresenceChange();
      }
      
      console.log('✅ Activity tracked successfully');
    } catch (error) {
      console.error('❌ Error tracking activity:', error);
      throw error;
    }
  }, []);

  // Reactive token that updates whenever presence cache changes
  const version = useSyncExternalStore(presenceStore.subscribe, presenceStore.getSnapshot);

  const contextValue: ExpertPresenceContextType = {
    getExpertPresence,
    checkExpertPresence,
    bulkCheckPresence,
    updateExpertPresence,
    trackActivity,
    isLoading,
    version
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