import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface TimeSlot {
  start_time: string;
  end_time: string;
  day_of_week: number;
  specific_date: string | null;
  timezone?: string;
}

export function useAvailabilityManagement(user: any) {
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

      // De-duplicate slots to prevent identical entries
      const uniqueMap = new Map<string, TimeSlot>();
      timeSlots.forEach(slot => {
        const key = `${slot.start_time}-${slot.end_time}-${slot.day_of_week}-${slot.specific_date || 'null'}`;
        if (!uniqueMap.has(key)) uniqueMap.set(key, slot);
      });

      const dedupedSlots = Array.from(uniqueMap.values());

      // Insert directly into expert_availabilities table (simple schema)
      // Each day + time range = one row
      const availabilityRecords = dedupedSlots.map(slot => ({
        expert_id: expertAuthId,
        day_of_week: slot.day_of_week, // 0-6 (Sunday=0, Monday=1, ..., Saturday=6)
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: true,
        timezone: slot.timezone || availabilityTimezone || 'UTC'
      }));

      const { error: insertError } = await supabase
        .from('expert_availabilities')
        // @ts-expect-error - TypeScript types are outdated, actual DB has day_of_week/start_time/end_time
        .insert(availabilityRecords);

      if (insertError) throw insertError;

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

  const fetchAvailabilities = useCallback(async () => {
    // Get auth_id from user object - try auth_id first, then fallback to id
    const expertAuthId = user?.auth_id || user?.id;
    if (!expertAuthId) {
      console.log('🚫 No auth_id or id found for user:', user);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching availabilities for auth_id:', expertAuthId);

      // Fetch from expert_availabilities table (simple schema)
      // Each row = one day with time range
      const { data, error: fetchError } = await supabase
        .from('expert_availabilities')
        .select('*')
        .eq('expert_id', expertAuthId)
        .eq('is_available', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (fetchError) throw fetchError;
      console.log('✅ Fetched availabilities:', data);
      setAvailabilities(data || []);
    } catch (err: any) {
      console.error('Error fetching availabilities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.auth_id, user?.id]);

  useEffect(() => {
    fetchAvailabilities();
  }, [fetchAvailabilities]); // Use fetchAvailabilities as dependency

  return {
    createAvailability,
    deleteAvailability,
    fetchAvailabilities,
    availabilities,
    loading,
    error
  };
}