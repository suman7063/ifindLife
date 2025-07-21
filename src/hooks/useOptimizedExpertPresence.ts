import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { updatePerformanceMetrics, trackCacheHit, trackResponseTime } from '@/components/expert-card/PresencePerformanceMonitor';

interface ExpertPresence {
  expertId: string;
  isOnline: boolean;
  lastSeen: string;
  status: 'available' | 'busy' | 'away' | 'offline';
}

interface PresenceCache {
  [expertId: string]: {
    data: ExpertPresence;
    lastUpdate: number;
    channelRef?: any;
  };
}

// Global cache to share presence data across components
let globalPresenceCache: PresenceCache = {};
let globalListeners: Set<Function> = new Set();

// Cache duration: 30 seconds
const CACHE_DURATION = 30000;
// Update interval for active presence checking: 10 seconds
const UPDATE_INTERVAL = 10000;

export function useOptimizedExpertPresence(expertIds: string[] = []) {
  const [presenceData, setPresenceData] = useState<PresenceCache>({});
  const [loading, setLoading] = useState(true);
  const listenersRef = useRef<Set<string>>(new Set());
  const updateTimerRef = useRef<NodeJS.Timeout>();

  // Notify all listeners about presence updates
  const notifyListeners = useCallback(() => {
    globalListeners.forEach(listener => listener(globalPresenceCache));
  }, []);

  // Update expert presence (for current expert)
  const updateExpertPresence = useCallback(async (
    expertAuthId: string, 
    status: 'available' | 'busy' | 'away' | 'offline'
  ) => {
    try {
      console.log('🔴 Optimized: Setting expert presence:', { expertAuthId, status });
      
      const channel = supabase.channel(`expert_presence_${expertAuthId}`);
      
      await channel.subscribe(async (subscriptionStatus) => {
        if (subscriptionStatus === 'SUBSCRIBED') {
          const presenceData = {
            expertId: expertAuthId,
            isOnline: status !== 'offline',
            lastSeen: new Date().toISOString(),
            status,
            timestamp: Date.now()
          };

          const trackStatus = await channel.track(presenceData);
          console.log('🟢 Optimized: Expert presence tracked:', trackStatus);
          
          // Update global cache
          globalPresenceCache[expertAuthId] = {
            data: {
              expertId: expertAuthId,
              isOnline: status !== 'offline',
              lastSeen: new Date().toISOString(),
              status
            },
            lastUpdate: Date.now(),
            channelRef: channel
          };
          
          notifyListeners();
        }
      });
    } catch (error) {
      console.error('❌ Optimized: Error updating expert presence:', error);
    }
  }, [notifyListeners]);

  // Subscribe to presence for a list of experts with smart caching
  const subscribeToExperts = useCallback((expertList: string[]) => {
    const now = Date.now();
    const newSubscriptions: string[] = [];

    expertList.forEach(expertId => {
      if (!expertId) return;

      // Check if we already have fresh data
      const cached = globalPresenceCache[expertId];
      if (cached && (now - cached.lastUpdate) < CACHE_DURATION) {
        // Only log in development and reduce frequency
        if (process.env.NODE_ENV === 'development' && Math.random() < 0.1) {
          console.log('🟡 Optimized: Using cached presence for:', expertId);
        }
        trackCacheHit();
        return;
      }

      // Check if we're already listening to this expert
      if (listenersRef.current.has(expertId)) {
        return;
      }

      newSubscriptions.push(expertId);
      listenersRef.current.add(expertId);
    });

    // Only subscribe to experts we don't have fresh data for
    if (newSubscriptions.length > 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔵 Optimized: New subscriptions needed for:', newSubscriptions);
      }
      
      // Update performance metrics
      updatePerformanceMetrics({
        activeConnections: Object.keys(globalPresenceCache).length + newSubscriptions.length
      });
      
      newSubscriptions.forEach(async (expertId) => {
        try {
          const startTime = Date.now();
          const channel = supabase.channel(`expert_presence_${expertId}`);
          
          channel
            .on('presence', { event: 'sync' }, () => {
              const presenceState = channel.presenceState();
              console.log('🟢 Optimized: Presence sync for expert:', expertId, presenceState);
              
              // Track response time
              const responseTime = Date.now() - startTime;
              trackResponseTime(responseTime);
              
              const expertPresence = Object.values(presenceState)[0];
              if (expertPresence && expertPresence.length > 0) {
                const latestPresence = expertPresence[0] as any;
                
                globalPresenceCache[expertId] = {
                  data: {
                    expertId,
                    isOnline: latestPresence.status !== 'offline',
                    lastSeen: latestPresence.lastSeen || new Date().toISOString(),
                    status: latestPresence.status || 'offline'
                  },
                  lastUpdate: Date.now(),
                  channelRef: channel
                };
              } else {
                // Expert is offline
                globalPresenceCache[expertId] = {
                  data: {
                    expertId,
                    isOnline: false,
                    lastSeen: new Date().toISOString(),
                    status: 'offline'
                  },
                  lastUpdate: Date.now(),
                  channelRef: channel
                };
              }
              
              notifyListeners();
            })
            .on('presence', { event: 'join' }, ({ newPresences }) => {
              console.log('🟢 Optimized: Expert joined:', expertId, newPresences);
              if (newPresences && newPresences.length > 0) {
                const presence = newPresences[0] as any;
                globalPresenceCache[expertId] = {
                  data: {
                    expertId,
                    isOnline: true,
                    lastSeen: presence.lastSeen || new Date().toISOString(),
                    status: presence.status || 'available'
                  },
                  lastUpdate: Date.now(),
                  channelRef: channel
                };
                notifyListeners();
              }
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
              console.log('🔴 Optimized: Expert left:', expertId, leftPresences);
              globalPresenceCache[expertId] = {
                data: {
                  expertId,
                  isOnline: false,
                  lastSeen: new Date().toISOString(),
                  status: 'offline'
                },
                lastUpdate: Date.now(),
                channelRef: channel
              };
              notifyListeners();
            });

          await channel.subscribe();
        } catch (error) {
          console.error('❌ Optimized: Error subscribing to expert presence:', expertId, error);
        }
      });
    }
  }, [notifyListeners]);

  // Cleanup stale cache entries
  const cleanupStaleCache = useCallback(() => {
    const now = Date.now();
    const staleTimeout = CACHE_DURATION * 3; // 90 seconds

    Object.keys(globalPresenceCache).forEach(expertId => {
      const cached = globalPresenceCache[expertId];
      if (cached && (now - cached.lastUpdate) > staleTimeout) {
        console.log('🧹 Optimized: Cleaning stale cache for:', expertId);
        
        // Unsubscribe from channel
        if (cached.channelRef) {
          cached.channelRef.unsubscribe();
        }
        
        delete globalPresenceCache[expertId];
        listenersRef.current.delete(expertId);
      }
    });
  }, []);

  // Listen for global presence updates
  useEffect(() => {
    const listener = (cache: PresenceCache) => {
      setPresenceData({ ...cache });
    };
    
    globalListeners.add(listener);
    
    // Initial state from cache
    setPresenceData({ ...globalPresenceCache });
    
    return () => {
      globalListeners.delete(listener);
    };
  }, []);

  // Subscribe to experts when expertIds change
  useEffect(() => {
    if (expertIds.length > 0) {
      setLoading(true);
      subscribeToExperts(expertIds);
      
      // Set up periodic cleanup
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
      
      updateTimerRef.current = setInterval(() => {
        cleanupStaleCache();
        // Refresh active subscriptions
        subscribeToExperts(expertIds);
      }, UPDATE_INTERVAL);
      
      // Initial loading done
      setTimeout(() => setLoading(false), 1000);
    } else {
      setLoading(false);
    }

    return () => {
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
    };
  }, [expertIds, subscribeToExperts, cleanupStaleCache]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up all subscriptions for this component
      listenersRef.current.forEach(expertId => {
        const cached = globalPresenceCache[expertId];
        if (cached?.channelRef) {
          cached.channelRef.unsubscribe();
        }
      });
      listenersRef.current.clear();
      
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
    };
  }, []);

  // Utility functions
  const isExpertOnline = useCallback((expertId: string): boolean => {
    const cached = globalPresenceCache[expertId];
    return cached?.data?.isOnline || false;
  }, []);

  const getExpertStatus = useCallback((expertId: string): 'online' | 'offline' => {
    return isExpertOnline(expertId) ? 'online' : 'offline';
  }, [isExpertOnline]);

  const getExpertAvailability = useCallback((expertId: string): 'available' | 'busy' | 'away' | 'offline' => {
    const cached = globalPresenceCache[expertId];
    return cached?.data?.status || 'offline';
  }, []);

  const getLastSeen = useCallback((expertId: string): string => {
    const cached = globalPresenceCache[expertId];
    if (!cached?.data?.lastSeen) return 'Unknown';
    
    const lastSeen = new Date(cached.data.lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  }, []);

  // Force refresh function
  const refreshPresence = useCallback(() => {
    // Clear cache for current experts
    expertIds.forEach(expertId => {
      if (globalPresenceCache[expertId]) {
        globalPresenceCache[expertId].lastUpdate = 0; // Force refresh
      }
    });
    
    subscribeToExperts(expertIds);
  }, [expertIds, subscribeToExperts]);

  return {
    presenceData,
    loading,
    updateExpertPresence,
    isExpertOnline,
    getExpertStatus,
    getExpertAvailability,
    getLastSeen,
    refreshPresence
  };
}