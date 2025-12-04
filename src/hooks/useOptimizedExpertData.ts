import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExpertCardData } from '@/components/expert-card/types';
import { useExpertPresence } from '@/contexts/ExpertPresenceContext';
import { getProfilePictureUrl } from '@/utils/profilePictureUtils';

interface UseOptimizedExpertDataProps {
  serviceId?: string;
  specialization?: string;
  enablePresenceChecking?: boolean;
}

// Type for raw expert data from database
type RawExpertData = {
  id?: string; // Optional - RPC function doesn't return id, only auth_id
  auth_id: string;
  name: string;
  profile_picture?: string;
  specialization?: string;
  experience?: string | number;
  average_rating?: number;
  reviews_count?: number;
  verified?: boolean;
  category?: string;
  status: string;
  profile_completed?: boolean;
  onboarding_completed?: boolean;
  pricing_set?: boolean;
  availability_set?: boolean;
  selected_services?: number[];
  [key: string]: unknown;
};

// Global cache to prevent duplicate API calls - Clear cache by setting timestamp to 0
const expertDataCache: {
  data: RawExpertData[] | null;
  timestamp: number;
  loading: boolean;
} = {
  data: null,
  timestamp: 0, // Force fresh fetch - cache cleared after migration
  loading: false
};

// Function to clear cache (useful after migrations or data updates)
export const clearExpertDataCache = () => {
  expertDataCache.data = null;
  expertDataCache.timestamp = 0;
  console.log('🗑️ Expert data cache cleared');
};

// Clear cache on module load to ensure fresh data after migration
clearExpertDataCache();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export function useOptimizedExpertData({ 
  serviceId, 
  specialization, 
  enablePresenceChecking = false // Disabled bulk checking by default
}: UseOptimizedExpertDataProps = {}) {
  const [experts, setExperts] = useState<ExpertCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawExperts, setRawExperts] = useState<RawExpertData[]>([]);

  // Call hook unconditionally at top level
  const presenceContext = useExpertPresence();
  
  const { getExpertPresence, bulkCheckPresence, version } = presenceContext || {
    getExpertPresence: () => null,
    bulkCheckPresence: () => Promise.resolve(),
    isLoading: false,
    version: 0
  };

  // Memoized expert mapping to prevent unnecessary recalculations
  const mapDbExpertToExpertCard = useMemo(() => {
    return (dbExpert: RawExpertData): ExpertCardData => {
      // Use auth_id as id if id is not present (RPC function returns auth_id but not id)
      const expertId = String(dbExpert.id || dbExpert.auth_id); // UUID from expert_accounts.id or auth_id
      const expertAuthId = dbExpert.auth_id;
      const isApproved = dbExpert.status === 'approved';
      // Use expert UUID for presence lookup (cache keyed by expert_id)
      const presence = getExpertPresence(expertId);
      const expertStatus = presence?.status || 'offline';
      const isAvailable = presence?.status === 'available' && presence?.acceptingCalls === true;
      
      // Get profile picture directly from database - this is the source of truth
      const profilePictureFromDB = dbExpert.profile_picture || '';
      
      // Convert path to URL if needed (handles both URLs and paths)
      const profilePictureUrl = getProfilePictureUrl(profilePictureFromDB);
      
      // Log for debugging
      if (dbExpert.name === 'John Doe' || profilePictureFromDB) {
        console.log(`📸 Database profile_picture for ${dbExpert.name} (${expertAuthId}):`, profilePictureFromDB || 'EMPTY');
        if (profilePictureFromDB && !profilePictureFromDB.startsWith('http')) {
          console.log(`🔄 Converted path to URL: ${profilePictureUrl}`);
        }
      }
      
      return {
        id: expertId,
        auth_id: expertAuthId,
        name: dbExpert.name || 'Unknown Expert',
        profilePicture: profilePictureUrl, // Use converted URL (handles both URLs and paths)
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
        dbStatus: dbExpert.status,
        profile_completed: Boolean(dbExpert.profile_completed),
        pricing_set: Boolean(dbExpert.pricing_set),
        availability_set: Boolean(dbExpert.availability_set)
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
        const isCacheValid = expertDataCache.data && expertDataCache.timestamp > 0 && (now - expertDataCache.timestamp) < CACHE_DURATION;
        
        if (isCacheValid && !expertDataCache.loading) {
          console.log('📦 Using cached expert data', expertDataCache.data.length, 'experts');
          setRawExperts(expertDataCache.data!);
          setLoading(false);
          return;
        }
        
        if (expertDataCache.data && expertDataCache.timestamp === 0) {
          console.log('🔄 Cache was cleared, fetching fresh data');
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

        console.log('📥 Raw RPC response:', data);
        console.log('📥 RPC response length:', data?.length);
        let filteredData = data || [];
        
        // Log profile_picture URLs from database
        console.log('📸 Profile pictures from database:');
        filteredData.forEach(expert => {
          console.log(`  - ${expert.name} (${expert.auth_id}): ${expert.profile_picture || 'NO IMAGE'}`);
        });
        
        // Ensure all experts have auth_id
        filteredData = filteredData.map(expert => {
          if (!expert.auth_id) {
            console.error('❌ Expert missing auth_id:', expert);
          }
          return expert;
        });

        // Apply filters in JavaScript since we're using RPC
        if (specialization) {
          filteredData = filteredData.filter(expert => 
            expert.specialization?.toLowerCase().includes(specialization.toLowerCase())
          );
        }

        if (serviceId) {
          const serviceIdNum = parseInt(serviceId);
          if (!isNaN(serviceIdNum)) {
            // Filter experts by checking expert_service_specializations table
            const expertIds = filteredData.map(e => e.auth_id || e.id).filter(Boolean);
            if (expertIds.length > 0) {
              const { data: specializations } = await supabase
                .from('expert_service_specializations')
                .select('expert_id')
                .in('expert_id', expertIds)
                .eq('service_id', serviceIdNum);
              
              const expertIdsWithService = new Set(specializations?.map(s => s.expert_id) || []);
              filteredData = filteredData.filter(expert => 
                expertIdsWithService.has(expert.auth_id || expert.id)
              );
            } else {
              filteredData = [];
            }
          }
        }

        console.log(`✅✅✅ Loaded ${filteredData.length} filtered experts ✅✅✅`);
        const expertNames = filteredData.map(e => e.name);
        console.log('✅✅✅ Expert names:', expertNames);
        console.log('✅✅✅ Expert auth_ids:', filteredData.map(e => e.auth_id));
        const hasJohnDoe = expertNames.includes('John Doe');
        console.log(hasJohnDoe ? '✅✅✅ JOHN DOE FOUND IN DATA!' : '❌❌❌ JOHN DOE NOT IN DATA!');
        console.log('Full expert data sample:', filteredData[0] ? {
          name: filteredData[0].name,
          auth_id: filteredData[0].auth_id,
          id: filteredData[0].id,
          hasAuthId: !!filteredData[0].auth_id,
          keys: Object.keys(filteredData[0])
        } : 'No experts');
        // Check for John Doe specifically in the raw data
        const johnDoeRaw = filteredData.find(e => e.name === 'John Doe');
        if (johnDoeRaw) {
          console.log('👤👤👤 John Doe in filteredData:', {
            name: johnDoeRaw.name,
            auth_id: johnDoeRaw.auth_id,
            hasAuthId: !!johnDoeRaw.auth_id,
            allKeys: Object.keys(johnDoeRaw)
          });
        } else {
          console.warn('❌ John Doe NOT in filteredData!');
        }
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

  // Listen for profile image updates to force refresh
  useEffect(() => {
    const handleProfileUpdate = async (event: CustomEvent) => {
      const authId = event.detail?.authId;
      const newUrl = event.detail?.profilePictureUrl;
      console.log('useOptimizedExpertData: Profile image update received', {
        authId,
        profilePictureUrl: newUrl,
        timestamp: event.detail?.timestamp
      });
      
      // If we have the authId, directly update that expert's data in the cache
      if (authId && newUrl && rawExperts.length > 0) {
        console.log('useOptimizedExpertData: Updating expert in cache directly');
        const updatedRawExperts = rawExperts.map(expert => {
          if (expert.auth_id === authId) {
            console.log(`Updating ${expert.name} profile_picture from "${expert.profile_picture}" to "${newUrl}"`);
            return { ...expert, profile_picture: newUrl };
          }
          return expert;
        });
        setRawExperts(updatedRawExperts);
      }
      
      // Clear cache and refetch to ensure database consistency
      clearExpertDataCache();
      expertDataCache.timestamp = 0;
      expertDataCache.data = null;
      
      // Wait a bit longer for database transaction to commit
      setTimeout(async () => {
        console.log('useOptimizedExpertData: Refetching expert data from database after profile update');
        try {
          await fetchExpertData();
          console.log('useOptimizedExpertData: Data refetched successfully from database');
        } catch (error) {
          console.error('useOptimizedExpertData: Error refetching data:', error);
        }
      }, 1500);
    };

    window.addEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
    window.addEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);

    return () => {
      window.removeEventListener('expertProfileImageUpdated', handleProfileUpdate as EventListener);
      window.removeEventListener('expertProfileRefreshed', handleProfileUpdate as EventListener);
    };
  }, [fetchExpertData, rawExperts]);

  useEffect(() => {
    fetchExpertData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, specialization]);

  // Update experts when raw data or presence changes
  useEffect(() => {
    if (rawExperts.length > 0) {
      console.log('📋 Mapping raw experts to cards:', rawExperts.length);
      // Check for John Doe specifically
      const johnDoe = rawExperts.find(e => e.name === 'John Doe');
      if (johnDoe) {
        console.log('👤 John Doe found in rawExperts:', {
          name: johnDoe.name,
          auth_id: johnDoe.auth_id,
          id: johnDoe.id,
          onboarding_completed: johnDoe.onboarding_completed
        });
      }
      const formattedExperts = rawExperts.map(expert => mapDbExpertToExpertCard(expert));
      console.log('✅ Formatted experts:', formattedExperts.length, 'Names:', formattedExperts.map(e => e.name));
      const johnDoeFormatted = formattedExperts.find(e => e.name === 'John Doe');
      if (johnDoeFormatted) {
        console.log('✅ John Doe formatted successfully:', {
          name: johnDoeFormatted.name,
          auth_id: johnDoeFormatted.auth_id,
          id: johnDoeFormatted.id,
          dbStatus: johnDoeFormatted.dbStatus
        });
      } else {
        console.warn('⚠️ John Doe NOT found in formatted experts!');
      }
      // No need to filter here - get_approved_experts() RPC function already filters by onboarding_completed = true
      setExperts(formattedExperts);
    } else if (rawExperts.length === 0) {
      console.log('⚠️ No raw experts to map');
      setExperts([]);
    }
  }, [rawExperts, mapDbExpertToExpertCard]);

  // Optionally fetch presence for listed experts
  useEffect(() => {
    if (!enablePresenceChecking || rawExperts.length === 0) return;
    // RPC function returns auth_id, use that for presence checking
    console.log('🔍 Raw experts for presence check:', rawExperts.length, rawExperts.map(e => ({ 
      name: e.name, 
      auth_id: e.auth_id,
      hasAuthId: !!e.auth_id,
      allKeys: Object.keys(e)
    })));
    
    // Filter out any experts without auth_id before mapping
    const validExperts = rawExperts.filter(e => {
      const hasAuthId = !!e.auth_id;
      if (!hasAuthId) {
        console.warn('⚠️ Skipping expert without auth_id:', e.name, 'Full object:', e);
      }
      return hasAuthId;
    });
    
    const ids = validExperts
      .map((e) => {
        const authId = e.auth_id;
        if (!authId) {
          console.error('❌ Unexpected: Expert missing auth_id after filter:', e.name);
          return null;
        }
        const idString = String(authId);
        // Validate it's a proper UUID format
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idString)) {
          console.warn('⚠️ Invalid UUID format:', idString, 'for expert:', e.name);
          return null;
        }
        return idString;
      })
      .filter((id): id is string => id !== null && id !== 'undefined' && id.length > 0);
      
    console.log('🔍 Checking presence for experts:', ids.length, 'IDs:', ids);
    if (ids.length > 0) {
      bulkCheckPresence(ids);
    } else {
      console.warn('⚠️ No valid expert IDs for presence check. Valid experts:', validExperts.length, 'Total rawExperts:', rawExperts.length);
    }
  }, [enablePresenceChecking, rawExperts, bulkCheckPresence]);

  return { experts, loading, error };
}