import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ExpertPresence {
  expertId: string;
  isOnline: boolean;
  lastSeen: string;
}

export function useExpertPresence(expertIds: string[] = []) {
  const [presenceData, setPresenceData] = useState<Record<string, ExpertPresence>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (expertIds.length === 0) {
      setLoading(false);
      return;
    }

    // For now, simulate online presence
    // In a real implementation, this would use Supabase realtime presence
    const simulatePresence = () => {
      const presence: Record<string, ExpertPresence> = {};
      
      expertIds.forEach(expertId => {
        // Randomly assign online status for demo purposes
        // In production, this would come from real presence data
        const isOnline = Math.random() > 0.3; // 70% chance of being online
        
        presence[expertId] = {
          expertId,
          isOnline,
          lastSeen: new Date().toISOString()
        };
      });

      setPresenceData(presence);
      setLoading(false);
    };

    simulatePresence();
    
    // Update presence every 30 seconds for demo
    const interval = setInterval(simulatePresence, 30000);
    
    return () => clearInterval(interval);
  }, [expertIds]);

  const isExpertOnline = (expertId: string): boolean => {
    return presenceData[expertId]?.isOnline || false;
  };

  const getExpertStatus = (expertId: string): 'online' | 'offline' => {
    return isExpertOnline(expertId) ? 'online' : 'offline';
  };

  return {
    presenceData,
    loading,
    isExpertOnline,
    getExpertStatus
  };
}