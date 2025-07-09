import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ExpertPresence {
  expertId: string;
  isOnline: boolean;
  lastSeen: string;
  currentClients?: number;
  status: 'available' | 'busy' | 'away' | 'offline';
}

export function useRealExpertPresence(expertIds: string[] = []) {
  const [presenceData, setPresenceData] = useState<Record<string, ExpertPresence>>({});
  const [loading, setLoading] = useState(true);

  // Initialize presence for current expert (when they log in)
  const updateExpertPresence = async (expertAuthId: string, status: 'available' | 'busy' | 'away' | 'offline') => {
    try {
      console.log('🔴 Setting expert presence:', { expertAuthId, status });
      const channel = supabase.channel(`expert_presence_${expertAuthId}`);
      
      const trackResult = await channel.track({
        user_id: expertAuthId,
        status,
        last_seen: new Date().toISOString(),
        current_clients: 0,
        online_at: new Date().toISOString()
      });

      console.log('🔴 Track result:', trackResult);
      
      const subscribeResult = await channel.subscribe();
      console.log('🔴 Subscribe result:', subscribeResult);
      
      // Update local state immediately
      setPresenceData(prev => ({
        ...prev,
        [expertAuthId]: {
          expertId: expertAuthId,
          isOnline: status !== 'offline',
          lastSeen: new Date().toISOString(),
          currentClients: 0,
          status
        }
      }));
    } catch (error) {
      console.error('❌ Error updating expert presence:', error);
    }
  };

  // Get expert presence using realtime
  useEffect(() => {
    if (expertIds.length === 0) {
      setLoading(false);
      return;
    }

    const channels: any[] = [];
    const presence: Record<string, ExpertPresence> = {};

    // Initialize presence for each expert
    expertIds.forEach(expertAuthId => {
      const channel = supabase.channel(`expert_presence_${expertAuthId}`);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const expertPresences = Object.values(state).flat() as any[];
          
          console.log('🟢 Expert presence sync:', { expertAuthId, presences: expertPresences });
          
          if (expertPresences.length > 0) {
            const latestPresence = expertPresences[0];
            presence[expertAuthId] = {
              expertId: expertAuthId,
              isOnline: latestPresence.status !== 'offline',
              lastSeen: latestPresence.last_seen || latestPresence.online_at || new Date().toISOString(),
              currentClients: latestPresence.current_clients || 0,
              status: latestPresence.status || 'offline'
            };
          } else {
            presence[expertAuthId] = {
              expertId: expertAuthId,
              isOnline: false,
              lastSeen: new Date().toISOString(),
              currentClients: 0,
              status: 'offline'
            };
          }
          
          setPresenceData({ ...presence });
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('🟢 Expert joined:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          console.log('🔴 Expert left:', leftPresences);
        })
        .subscribe();

      channels.push(channel);
    });

    setLoading(false);

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [expertIds]);

  const isExpertOnline = (expertId: string): boolean => {
    if (!expertId) return false;
    const online = presenceData[expertId]?.isOnline || false;
    console.log('🔍 Checking expert online status:', { expertId, online, presenceData: presenceData[expertId] });
    return online;
  };

  const getExpertStatus = (expertId: string): 'online' | 'offline' => {
    if (!expertId) return 'offline';
    return isExpertOnline(expertId) ? 'online' : 'offline';
  };

  const getExpertAvailability = (expertId: string): 'available' | 'busy' | 'away' | 'offline' => {
    if (!expertId) return 'offline';
    return presenceData[expertId]?.status || 'offline';
  };

  const getLastSeen = (expertId: string): string => {
    const lastSeen = presenceData[expertId]?.lastSeen;
    if (!lastSeen) return 'Never';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  return {
    presenceData,
    loading,
    isExpertOnline,
    getExpertStatus,
    getExpertAvailability,
    getLastSeen,
    updateExpertPresence
  };
}