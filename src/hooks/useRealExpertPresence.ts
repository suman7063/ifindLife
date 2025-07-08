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
  const updateExpertPresence = async (expertId: string, status: 'available' | 'busy' | 'away' | 'offline') => {
    try {
      const channel = supabase.channel(`expert_${expertId}`);
      
      await channel.track({
        user_id: expertId,
        status,
        last_seen: new Date().toISOString(),
        current_clients: 0
      });

      await channel.subscribe();
    } catch (error) {
      console.error('Error updating expert presence:', error);
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
    expertIds.forEach(expertId => {
      const channel = supabase.channel(`presence_${expertId}`);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const expertPresences = Object.values(state).flat() as any[];
          
          if (expertPresences.length > 0) {
            const latestPresence = expertPresences[0];
            presence[expertId] = {
              expertId,
              isOnline: latestPresence.status !== 'offline',
              lastSeen: latestPresence.last_seen || new Date().toISOString(),
              currentClients: latestPresence.current_clients || 0,
              status: latestPresence.status || 'offline'
            };
          } else {
            presence[expertId] = {
              expertId,
              isOnline: false,
              lastSeen: new Date().toISOString(),
              currentClients: 0,
              status: 'offline'
            };
          }
          
          setPresenceData({ ...presence });
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          console.log('Expert joined:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          console.log('Expert left:', leftPresences);
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
    return presenceData[expertId]?.isOnline || false;
  };

  const getExpertStatus = (expertId: string): 'online' | 'offline' => {
    return isExpertOnline(expertId) ? 'online' : 'offline';
  };

  const getExpertAvailability = (expertId: string): 'available' | 'busy' | 'away' | 'offline' => {
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