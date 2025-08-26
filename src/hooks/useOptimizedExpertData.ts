import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExpertCardData } from '@/components/expert-card/types';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';

interface UseOptimizedExpertDataProps {
  serviceId?: string;
  specialization?: string;
  enablePresenceChecking?: boolean;
}

// Global cache to prevent duplicate API calls - Clear cache by setting timestamp to 0
let expertDataCache: {
  data: any[] | null;
  timestamp: number;
  loading: boolean;
} = {
  data: null,
  timestamp: 0, // Force fresh fetch
  loading: false
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export function useOptimizedExpertData({ 
  serviceId, 
  specialization, 
  enablePresenceChecking = false // Disabled bulk checking by default
}: UseOptimizedExpertDataProps = {}) {
  const [experts, setExperts] = useState<ExpertCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawExperts, setRawExperts] = useState<any[]>([]);

  // Safe context access to prevent errors when provider is not available
  const presenceContext = (() => {
    try {
      return useExpertPresence();
    } catch (error) {
      console.warn('ExpertPresence context not available, using fallback');
      return {
        getExpertPresence: () => null,
        bulkCheckPresence: () => Promise.resolve(),
        isLoading: false
      };
    }
  })();
  
  const { getExpertPresence, bulkCheckPresence } = presenceContext;

  // Memoized expert mapping to prevent unnecessary recalculations
  const mapDbExpertToExpertCard = useMemo(() => {
    return (dbExpert: any): ExpertCardData => {
      const expertId = String(dbExpert.id);
      const expertAuthId = dbExpert.auth_id;
      const isApproved = dbExpert.status === 'approved';
      const presence = getExpertPresence(expertAuthId);
      const expertStatus = presence?.status || 'offline';
      const isAvailable = presence?.status === 'available' && presence?.acceptingCalls === true;
      
      return {
        id: expertId,
        auth_id: expertAuthId,
        name: dbExpert.name || 'Unknown Expert',
        profilePicture: dbExpert.profile_picture || '',
        specialization: dbExpert.specialization || 'General Counseling',
        experience: typeof dbExpert.experience === 'string' ? parseInt(dbExpert.experience) || 0 : Number(dbExpert.experience) || 0,
        averageRating: Number(dbExpert.average_rating) || 4.5,
        reviewsCount: Number(dbExpert.reviews_count) || 0,
        price: 30,
        verified: Boolean(dbExpert.verified),
        status: isApproved && isAvailable ? 'online' : 'offline',
        waitTime: isApproved && isAvailable ? 'Available Now' : 
                  isApproved && expertStatus === 'away' ? 'Away' : 'Not Available',
        category: dbExpert.category || 'listening-volunteer',
        dbStatus: dbExpert.status
      };
    };
  }, [getExpertPresence]);

  // Optimized data fetching with caching
  const fetchExpertData = useMemo(() => {
    return async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check cache first
        const now = Date.now();
        const isCacheValid = expertDataCache.data && (now - expertDataCache.timestamp) < CACHE_DURATION;
        
        if (isCacheValid && !expertDataCache.loading) {
          console.log('📦 Using cached expert data');
          setRawExperts(expertDataCache.data!);
          setLoading(false);
          return;
        }

        // Prevent duplicate API calls
        if (expertDataCache.loading) {
          console.log('⏳ Expert data fetch already in progress, waiting...');
          // Wait for the current fetch to complete
          const checkInterval = setInterval(() => {
            if (!expertDataCache.loading) {
              clearInterval(checkInterval);
              if (expertDataCache.data) {
                setRawExperts(expertDataCache.data);
              }
              setLoading(false);
            }
          }, 100);
          return;
        }

        console.log('🔄 Fetching fresh expert data');
        expertDataCache.loading = true;
        
        const { data, error } = await supabase
          .rpc('get_approved_experts');

        if (error) {
          console.error('❌ Error fetching experts:', error);
          throw error;
        }

        let filteredData = data || [];

        // Apply filters in JavaScript since we're using RPC
        if (specialization) {
          filteredData = filteredData.filter(expert => 
            expert.specialization?.toLowerCase().includes(specialization.toLowerCase())
          );
        }

        if (serviceId) {
          const serviceIdNum = parseInt(serviceId);
          if (!isNaN(serviceIdNum)) {
            filteredData = filteredData.filter(expert => 
              expert.selected_services?.includes(serviceIdNum)
            );
          }
        }
        
        // Update cache
        expertDataCache = {
          data: filteredData,
          timestamp: now,
          loading: false
        };
        
        console.log(`✅ Loaded ${filteredData.length} experts`);
        setRawExperts(filteredData);
        
      } catch (err) {
        console.error('❌ Error loading experts:', err);
        setError('Failed to load experts');
        setExperts([]);
        expertDataCache.loading = false;
      } finally {
        setLoading(false);
      }
    };
  }, [serviceId, specialization]);

  // Effect to fetch data
  useEffect(() => {
    fetchExpertData();
  }, [fetchExpertData]);

  // Effect to update expert cards when presence changes (memoized)
  const formattedExperts = useMemo(() => {
    if (rawExperts.length === 0) return [];
    return rawExperts.map(mapDbExpertToExpertCard);
  }, [rawExperts, mapDbExpertToExpertCard]);

  useEffect(() => {
    setExperts(formattedExperts);
  }, [formattedExperts]);

  // REMOVED: Bulk presence checking on every expert list load
  // Presence is now only checked when:
  // 1. Expert logs in/out (handled by useIntegratedExpertPresence)
  // 2. User interacts with individual expert card (handled by ExpertDetail page)
  // 3. Expert manually changes status (handled by MasterStatusControl)
  
  // No automatic bulk checking to reduce unnecessary API calls

  return {
    experts,
    loading,
    error,
    refetch: () => {
      // Clear cache and refetch
      expertDataCache = { data: null, timestamp: 0, loading: false };
      fetchExpertData();
    }
  };
}