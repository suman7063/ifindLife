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
        isLoading: false,
        version: 0
      } as any;
    }
  })();
  
  const { getExpertPresence, bulkCheckPresence, version } = presenceContext;

  // Memoized expert mapping to prevent unnecessary recalculations
  const mapDbExpertToExpertCard = useMemo(() => {
    return (dbExpert: any): ExpertCardData => {
      const expertId = String(dbExpert.id); // UUID from expert_accounts.id
      const expertAuthId = dbExpert.auth_id;
      const isApproved = dbExpert.status === 'approved';
      // Use expert UUID for presence lookup (cache keyed by expert_id)
      const presence = getExpertPresence(expertId);
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
  }, [getExpertPresence, version]);

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

        console.log(`Loaded ${filteredData.length} filtered experts`);
        expertDataCache.data = filteredData;
        expertDataCache.timestamp = Date.now();
        expertDataCache.loading = false;

        setRawExperts(filteredData);
      } catch (err) {
        console.error('Error loading experts:', err);
        setError('Failed to load experts');
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };
  }, [serviceId, specialization]);

  useEffect(() => {
    fetchExpertData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, specialization]);

  // Update experts when raw data or presence changes
  useEffect(() => {
    if (rawExperts.length > 0) {
      const formattedExperts = rawExperts.map(expert => mapDbExpertToExpertCard(expert));
      setExperts(formattedExperts);
    }
  }, [rawExperts, mapDbExpertToExpertCard]);

  // Optionally fetch presence for listed experts
  useEffect(() => {
    if (!enablePresenceChecking || rawExperts.length === 0) return;
    const ids = rawExperts.map((e) => String(e.id));
    bulkCheckPresence(ids);
  }, [enablePresenceChecking, rawExperts, bulkCheckPresence]);

  return { experts, loading, error };
}