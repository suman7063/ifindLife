import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface TimeSlot {
  start_time: string;
  end_time: string;
  day_of_week: number;
  specific_date: string | null;
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
    timeSlots: TimeSlot[]
  ) => {
    try {
      setLoading(true);
      
      console.log('🔧 Creating availability with auth_id:', expertAuthId);

      // First, create the availability record
      const { data: availability, error: availabilityError } = await supabase
        .from('expert_availabilities')
        .insert({
          expert_id: expertAuthId,
          start_date: startDate,
          end_date: endDate,
          availability_type: availabilityType
        })
        .select()
        .single();

      if (availabilityError) throw availabilityError;

      // Then, create time slots for this availability
      const timeSlotsToInsert = timeSlots.map(slot => ({
        availability_id: availability.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        day_of_week: slot.day_of_week,
        specific_date: slot.specific_date,
        is_booked: false
      }));

      const { error: slotsError } = await supabase
        .from('expert_time_slots')
        .insert(timeSlotsToInsert);

      if (slotsError) throw slotsError;

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

      // Delete time slots first
      await supabase
        .from('expert_time_slots')
        .delete()
        .eq('availability_id', availabilityId);

      // Then delete availability
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

  const fetchAvailabilities = async () => {
    if (!user?.auth_id) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching availabilities for auth_id:', user.auth_id);

      const { data, error: fetchError } = await supabase
        .from('expert_availabilities')
        .select(`
          *,
          time_slots:expert_time_slots(*)
        `)
        .eq('expert_id', user.auth_id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAvailabilities(data || []);
    } catch (err: any) {
      console.error('Error fetching availabilities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, [user?.auth_id]);

  return {
    createAvailability,
    deleteAvailability,
    fetchAvailabilities,
    availabilities,
    loading,
    error
  };
}