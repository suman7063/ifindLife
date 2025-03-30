
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Availability, TimeSlot } from '@/types/appointments';
import { UserProfile } from '@/types/supabase';

export const useAvailabilityManagement = (currentUser: UserProfile | null) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch expert availabilities
  const fetchAvailabilities = async (expertId: string) => {
    try {
      setLoading(true);
      
      // Use RPC to get availability data
      const { data: availabilityData, error: availabilityError } = await supabase
        .rpc('query_expert_availability', { expert_id_param: expertId });
      
      if (availabilityError) throw availabilityError;
      
      if (!availabilityData || availabilityData.length === 0) {
        setAvailabilities([]);
        return [];
      }

      // For each availability, fetch time slots using RPC
      const availabilitiesWithSlots = await Promise.all(
        availabilityData.map(async (availability: any) => {
          const { data: timeSlots, error: timeSlotsError } = await supabase
            .rpc('query_expert_time_slots', { availability_id_param: availability.id });
          
          if (timeSlotsError) throw timeSlotsError;
          
          // Return properly shaped data
          return {
            id: availability.id,
            expert_id: availability.expert_id,
            start_date: availability.start_date,
            end_date: availability.end_date,
            availability_type: availability.availability_type,
            time_slots: timeSlots || []
          } as Availability;
        })
      );
      
      setAvailabilities(availabilitiesWithSlots);
      return availabilitiesWithSlots;
    } catch (error: any) {
      console.error('Error fetching availabilities:', error);
      setError(error.message);
      toast.error('Failed to load expert availabilities');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create availability
  const createAvailability = async (
    expertId: string, 
    startDate: string, 
    endDate: string, 
    availabilityType: 'date_range' | 'recurring',
    timeSlots: Omit<TimeSlot, 'id' | 'availability_id'>[]
  ) => {
    try {
      setLoading(true);
      
      // Insert availability using RPC
      const { data: availabilityId, error: availabilityError } = await supabase
        .rpc('create_expert_availability', {
          p_expert_id: expertId,
          p_start_date: startDate,
          p_end_date: endDate,
          p_availability_type: availabilityType
        });
      
      if (availabilityError) throw availabilityError;
      
      if (!availabilityId) {
        throw new Error('Failed to create availability');
      }
      
      // Insert time slots using RPC for each slot
      for (const slot of timeSlots) {
        const { error: slotError } = await supabase
          .rpc('create_expert_time_slot', {
            p_availability_id: availabilityId,
            p_start_time: slot.start_time,
            p_end_time: slot.end_time,
            p_day_of_week: slot.day_of_week,
            p_specific_date: slot.specific_date
          });
        
        if (slotError) throw slotError;
      }
      
      // Fetch updated availabilities
      await fetchAvailabilities(expertId);
      
      toast.success('Availability created successfully');
      return { availability: availabilityId };
    } catch (error: any) {
      console.error('Error creating availability:', error);
      setError(error.message);
      toast.error('Failed to create availability');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete availability
  const deleteAvailability = async (availabilityId: string) => {
    try {
      setLoading(true);
      
      // Delete the availability using RPC
      const { error } = await supabase
        .rpc('delete_expert_availability', { availability_id_param: availabilityId });
      
      if (error) throw error;
      
      // Update the state by filtering out the deleted availability
      setAvailabilities(prev => prev.filter(a => a.id !== availabilityId));
      
      toast.success('Availability deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting availability:', error);
      setError(error.message);
      toast.error('Failed to delete availability');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    availabilities,
    loading,
    error,
    fetchAvailabilities,
    createAvailability,
    deleteAvailability
  };
};
