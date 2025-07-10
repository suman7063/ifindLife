import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedExpertPresence {
  expertId: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  lastActivity: string;
  autoAwayEnabled: boolean;
  awayTimeoutMinutes: number;
  isOnline: boolean;
  awayMessageCount?: number;
}

interface PresenceCache {
  [expertId: string]: {
    data: EnhancedExpertPresence;
    lastUpdate: number;
    channelRef?: any;
  };
}

// Global cache for presence data
let globalPresenceCache: PresenceCache = {};
let globalListeners: Set<Function> = new Set();

const CACHE_DURATION = 30000; // 30 seconds
const ACTIVITY_CHECK_INTERVAL = 60000; // 1 minute
const AWAY_CHECK_INTERVAL = 300000; // 5 minutes

export function useEnhancedExpertPresence(expertIds: string[] = []) {
  const [presenceData, setPresenceData] = useState<PresenceCache>({});
  const [loading, setLoading] = useState(true);
  const listenersRef = useRef<Set<string>>(new Set());
  const activityTimerRef = useRef<NodeJS.Timeout>();
  const awayCheckTimerRef = useRef<NodeJS.Timeout>();

  // Notify all listeners about presence updates
  const notifyListeners = useCallback(() => {
    globalListeners.forEach(listener => listener(globalPresenceCache));
  }, []);

  // Update expert presence status
  const updateExpertPresence = useCallback(async (
    expertAuthId: string, 
    status: 'available' | 'busy' | 'away' | 'offline',
    updateActivity: boolean = true
  ) => {
    try {
      console.log('🔄 Enhanced: Updating expert presence:', { expertAuthId, status, updateActivity });
      
      // Update in database
      const updateData: any = { status };
      if (updateActivity) {
        updateData.last_activity = new Date().toISOString();
      }

      const { error } = await supabase
        .from('expert_presence')
        .upsert({
          expert_id: expertAuthId,
          ...updateData
        });

      if (error) {
        console.error('❌ Enhanced: Error updating presence in DB:', error);
        return;
      }

      // Update realtime presence
      const channel = supabase.channel(`expert_presence_${expertAuthId}`);
      
      await channel.subscribe(async (subscriptionStatus) => {
        if (subscriptionStatus === 'SUBSCRIBED') {
          const presenceData = {
            expertId: expertAuthId,
            status,
            lastActivity: new Date().toISOString(),
            isOnline: status !== 'offline',
            timestamp: Date.now()
          };

          await channel.track(presenceData);
          console.log('🟢 Enhanced: Expert presence tracked:', { expertAuthId, status });
          
          // Update global cache
          globalPresenceCache[expertAuthId] = {
            data: {
              expertId: expertAuthId,
              status,
              lastActivity: new Date().toISOString(),
              autoAwayEnabled: true,
              awayTimeoutMinutes: 10,
              isOnline: status !== 'offline'
            },
            lastUpdate: Date.now(),
            channelRef: channel
          };
          
          notifyListeners();
        }
      });
    } catch (error) {
      console.error('❌ Enhanced: Error updating expert presence:', error);
    }
  }, [notifyListeners]);

  // Track activity for current expert
  const trackActivity = useCallback(async (expertAuthId: string) => {
    try {
      const { error } = await supabase
        .from('expert_presence')
        .update({ 
          last_activity: new Date().toISOString(),
          status: 'available' // Reset to available on activity
        })
        .eq('expert_id', expertAuthId);

      if (error) {
        console.error('❌ Enhanced: Error tracking activity:', error);
      } else {
        console.log('✅ Enhanced: Activity tracked for expert:', expertAuthId);
      }
    } catch (error) {
      console.error('❌ Enhanced: Error in trackActivity:', error);
    }
  }, []);

  // Check for experts that should be set to away
  const checkAwayStatus = useCallback(async () => {
    try {
      // Call the database function to update away status
      const { error } = await supabase.rpc('update_expert_away_status');
      
      if (error) {
        console.error('❌ Enhanced: Error checking away status:', error);
      } else {
        console.log('✅ Enhanced: Away status check completed');
      }
    } catch (error) {
      console.error('❌ Enhanced: Error in checkAwayStatus:', error);
    }
  }, []);

  // Load presence data from database
  const loadPresenceFromDB = useCallback(async (expertList: string[]) => {
    try {
      const { data, error } = await supabase
        .from('expert_presence')
        .select('*')
        .in('expert_id', expertList);

      if (error) {
        console.error('❌ Enhanced: Error loading presence from DB:', error);
        return;
      }

      if (data) {
        data.forEach((presence: any) => {
          globalPresenceCache[presence.expert_id] = {
            data: {
              expertId: presence.expert_id,
              status: presence.status,
              lastActivity: presence.last_activity,
              autoAwayEnabled: presence.auto_away_enabled,
              awayTimeoutMinutes: presence.away_timeout_minutes,
              isOnline: presence.status !== 'offline'
            },
            lastUpdate: Date.now()
          };
        });

        notifyListeners();
      }
    } catch (error) {
      console.error('❌ Enhanced: Error in loadPresenceFromDB:', error);
    }
  }, [notifyListeners]);

  // Subscribe to realtime presence updates
  const subscribeToPresence = useCallback((expertList: string[]) => {
    expertList.forEach(expertId => {
      if (!expertId || listenersRef.current.has(expertId)) return;

      const channel = supabase.channel(`expert_presence_${expertId}`);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState();
          console.log('🔄 Enhanced: Presence sync for expert:', expertId, presenceState);
          
          const expertPresence = Object.values(presenceState)[0];
          if (expertPresence && expertPresence.length > 0) {
            const latestPresence = expertPresence[0] as any;
            
            globalPresenceCache[expertId] = {
              data: {
                expertId,
                status: latestPresence.status || 'offline',
                lastActivity: latestPresence.lastActivity || new Date().toISOString(),
                autoAwayEnabled: true,
                awayTimeoutMinutes: 10,
                isOnline: latestPresence.status !== 'offline'
              },
              lastUpdate: Date.now(),
              channelRef: channel
            };
          } else {
            // Expert is offline
            globalPresenceCache[expertId] = {
              data: {
                expertId,
                status: 'offline',
                lastActivity: new Date().toISOString(),
                autoAwayEnabled: true,
                awayTimeoutMinutes: 10,
                isOnline: false
              },
              lastUpdate: Date.now(),
              channelRef: channel
            };
          }
          
          notifyListeners();
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('🟢 Enhanced: Expert joined:', expertId, newPresences);
          if (newPresences && newPresences.length > 0) {
            const presence = newPresences[0] as any;
            globalPresenceCache[expertId] = {
              data: {
                expertId,
                status: presence.status || 'available',
                lastActivity: presence.lastActivity || new Date().toISOString(),
                autoAwayEnabled: true,
                awayTimeoutMinutes: 10,
                isOnline: true
              },
              lastUpdate: Date.now(),
              channelRef: channel
            };
            notifyListeners();
          }
        })
        .on('presence', { event: 'leave' }, () => {
          console.log('🔴 Enhanced: Expert left:', expertId);
          globalPresenceCache[expertId] = {
            data: {
              expertId,
              status: 'offline',
              lastActivity: new Date().toISOString(),
              autoAwayEnabled: true,
              awayTimeoutMinutes: 10,
              isOnline: false
            },
            lastUpdate: Date.now(),
            channelRef: channel
          };
          notifyListeners();
        });

      channel.subscribe();
      listenersRef.current.add(expertId);
    });
  }, [notifyListeners]);

  // Listen for global presence updates
  useEffect(() => {
    const listener = (cache: PresenceCache) => {
      setPresenceData({ ...cache });
    };
    
    globalListeners.add(listener);
    setPresenceData({ ...globalPresenceCache });
    
    return () => {
      globalListeners.delete(listener);
    };
  }, []);

  // Subscribe to experts and set up timers
  useEffect(() => {
    if (expertIds.length > 0) {
      setLoading(true);
      
      // Load from database first
      loadPresenceFromDB(expertIds);
      
      // Then subscribe to realtime updates
      subscribeToPresence(expertIds);
      
      // Set up periodic away status check
      awayCheckTimerRef.current = setInterval(checkAwayStatus, AWAY_CHECK_INTERVAL);
      
      setLoading(false);
    }

    return () => {
      if (awayCheckTimerRef.current) {
        clearInterval(awayCheckTimerRef.current);
      }
    };
  }, [expertIds, loadPresenceFromDB, subscribeToPresence, checkAwayStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      listenersRef.current.forEach(expertId => {
        const cached = globalPresenceCache[expertId];
        if (cached?.channelRef) {
          cached.channelRef.unsubscribe();
        }
      });
      listenersRef.current.clear();
      
      if (activityTimerRef.current) {
        clearInterval(activityTimerRef.current);
      }
      if (awayCheckTimerRef.current) {
        clearInterval(awayCheckTimerRef.current);
      }
    };
  }, []);

  // Utility functions
  const isExpertOnline = useCallback((expertId: string): boolean => {
    const cached = globalPresenceCache[expertId];
    return cached?.data?.isOnline || false;
  }, []);

  const getExpertStatus = useCallback((expertId: string): 'available' | 'busy' | 'away' | 'offline' => {
    const cached = globalPresenceCache[expertId];
    return cached?.data?.status || 'offline';
  }, []);

  const getLastActivity = useCallback((expertId: string): string => {
    const cached = globalPresenceCache[expertId];
    if (!cached?.data?.lastActivity) return 'Unknown';
    
    const lastActivity = new Date(cached.data.lastActivity);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  }, []);

  return {
    presenceData,
    loading,
    updateExpertPresence,
    trackActivity,
    isExpertOnline,
    getExpertStatus,
    getLastActivity,
    checkAwayStatus
  };
}