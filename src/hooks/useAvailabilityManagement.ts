import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface TimeSlot {
  start_time: string;
  end_time: string;
  day_of_week: number;
  specific_date: string | null;
  timezone?: string;
}

// Cache for availability data to prevent unnecessary refetches
const availabilityCache = new Map<string, { data: any[]; timestamp: number }>();
const CACHE_DURATION = 30000; // Cache for 30 seconds

export function useAvailabilityManagement(user: any) {
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 2000; // Reduced to 2 seconds for better UX
  const expertAuthIdRef = useRef<string | null>(null);

  const createAvailability = async (
    expertAuthId: string,
    startDate: string,
    endDate: string,
    availabilityType: 'date_range' | 'recurring',
    timeSlots: TimeSlot[],
    availabilityTimezone?: string
  ) => {
    try {
      setLoading(true);
      
      console.log('🔧 Creating availability with auth_id:', expertAuthId);

      // Delete existing availability first (clean slate approach)
      await supabase
        .from('expert_availabilities')
        .delete()
        .eq('expert_id', expertAuthId);

      // Invalidate cache
      availabilityCache.delete(expertAuthId);

      // De-duplicate slots to prevent identical entries
      const uniqueMap = new Map<string, TimeSlot>();
      timeSlots.forEach(slot => {
        const key = `${slot.start_time}-${slot.end_time}-${slot.day_of_week}-${slot.specific_date || 'null'}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, slot);
      });

      const dedupedSlots = Array.from(uniqueMap.values());

      // Insert directly into expert_availabilities table (simple schema)
      // Each day + time range = one row
      // Include start_date and end_date for date range filtering
      const availabilityRecords = dedupedSlots.map(slot => ({
        expert_id: expertAuthId,
        day_of_week: slot.day_of_week, // 0-6 (Sunday=0, Monday=1, ..., Saturday=6)
        start_time: slot.start_time,
        end_time: slot.end_time,
        start_date: startDate, // Availability start date
        end_date: endDate, // Availability end date
        is_available: true,
        timezone: slot.timezone || availabilityTimezone || 'UTC'
      }));

      const { error: insertError } = await supabase
        .from('expert_availabilities')
        // @ts-expect-error - TypeScript types are outdated, actual DB has day_of_week/start_time/end_time
        .insert(availabilityRecords);

      if (insertError) throw insertError;

      // Update cache with new data
      const now = Date.now();
      availabilityCache.set(expertAuthId, {
        data: availabilityRecords,
        timestamp: now
      });
      setAvailabilities(availabilityRecords);

      console.log('✅ Availability created successfully:', availabilityRecords.length, 'records');
      return true;
    } catch (error) {
      console.error('Error creating availability:', error);
      toast.error('Failed to create availability');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (availabilityId: string) => {
    try {
      setLoading(true);

      // Delete availability record (simple schema - no related tables)
      const { error } = await supabase
        .from('expert_availabilities')
        .delete()
        .eq('id', availabilityId);

      if (error) throw error;

      // Invalidate cache and update local state
      const expertAuthId = user?.auth_id || user?.id;
      if (expertAuthId) {
        availabilityCache.delete(expertAuthId);
        // Update local state by removing deleted item
        setAvailabilities(prev => prev.filter(av => av.id !== availabilityId));
      }

      toast.success('Availability deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('Failed to delete availability');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailabilities = useCallback(async (forceRefresh = false) => {
    // Get auth_id from user object - try auth_id first, then fallback to id
    const expertAuthId = user?.auth_id || user?.id;
    if (!expertAuthId) {
      console.log('🚫 No auth_id or id found for user:', user);
      return;
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = availabilityCache.get(expertAuthId);
      const now = Date.now();
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log('✅ Using cached availability data');
        setAvailabilities(cached.data);
        setLoading(false);
        return;
      }
    }

    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('⏸️ Availability fetch already in progress, skipping...');
      return;
    }

    // Throttle fetches - but allow initial load immediately
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    const isInitialLoad = expertAuthIdRef.current !== expertAuthId;
    
    // Only throttle if not initial load and within interval
    if (!isInitialLoad && timeSinceLastFetch < MIN_FETCH_INTERVAL) {
      console.log('⏸️ Throttling availability fetch - too soon since last one:', timeSinceLastFetch, 'ms');
      // Use cached data if available
      const cached = availabilityCache.get(expertAuthId);
      if (cached) {
        setAvailabilities(cached.data);
      }
      return;
    }

    try {
      isFetchingRef.current = true;
      lastFetchTimeRef.current = now;
      expertAuthIdRef.current = expertAuthId;
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching availabilities for auth_id:', expertAuthId);

      // Optimized query - select only needed fields
      const { data, error: fetchError } = await supabase
        .from('expert_availabilities')
        .select('id, expert_id, day_of_week, start_time, end_time, start_date, end_date, is_available, timezone')
        .eq('expert_id', expertAuthId)
        .eq('is_available', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (fetchError) throw fetchError;
      
      const availabilityData = data || [];
      
      // Update cache
      availabilityCache.set(expertAuthId, {
        data: availabilityData,
        timestamp: now
      });
      
      setAvailabilities(availabilityData);
    } catch (err: any) {
      console.error('Error fetching availabilities:', err);
      setError(err.message);
      // Try to use cached data on error
      const cached = availabilityCache.get(expertAuthId);
      if (cached) {
        console.log('⚠️ Using cached data due to error');
        setAvailabilities(cached.data);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [user?.auth_id, user?.id]);

  // Only fetch when expertAuthId actually changes, not on every render
  const expertAuthId = user?.auth_id || user?.id;
  useEffect(() => {
    if (expertAuthId && expertAuthIdRef.current !== expertAuthId) {
      fetchAvailabilities();
    }
  }, [expertAuthId, fetchAvailabilities]);

  return {
    createAvailability,
    deleteAvailability,
    fetchAvailabilities,
    availabilities,
    loading,
    error
  };
}