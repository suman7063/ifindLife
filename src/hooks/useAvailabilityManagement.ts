
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Availability, TimeSlot } from '@/types/appointments';
import { UserProfile } from '@/types/supabase';
import { handleDatabaseError, retryOperation } from '@/utils/errorHandling';

export const useAvailabilityManagement = (currentUser: UserProfile | null) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch expert availabilities
  const fetchAvailabilities = async (expertId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch availabilities with retry - fixed to properly handle Promise
      const availabilityResult = await retryOperation(async () => {
        const response = await supabase
          .from('expert_availabilities')
          .select('*')
          .eq('expert_id', expertId);
        return response;
      });
      
      if (availabilityResult.error) {
        handleDatabaseError(availabilityResult.error, 'Failed to load expert availabilities');
        throw availabilityResult.error;
      }
      
      const availabilityData = availabilityResult.data;
      
      if (!availabilityData || availabilityData.length === 0) {
        setAvailabilities([]);
        return [];
      }

      // For each availability, fetch time slots
      const availabilitiesWithSlots = await Promise.all(
        availabilityData.map(async (availability) => {
          try {
            const timeSlotsResult = await supabase
              .from('expert_time_slots')
              .select('*')
              .eq('availability_id', availability.id);
            
            if (timeSlotsResult.error) {
              handleDatabaseError(timeSlotsResult.error, 'Failed to load time slots');
              throw timeSlotsResult.error;
            }
            
            const timeSlots = timeSlotsResult.data;
            
            // Return properly shaped data
            return {
              id: availability.id,
              expert_id: availability.expert_id,
              start_date: availability.start_date,
              end_date: availability.end_date,
              availability_type: availability.availability_type,
              time_slots: timeSlots || []
            } as Availability;
          } catch (error) {
            console.error(`Error fetching time slots for availability ${availability.id}:`, error);
            // Return availability without time slots in case of error
            return {
              id: availability.id,
              expert_id: availability.expert_id,
              start_date: availability.start_date,
              end_date: availability.end_date,
              availability_type: availability.availability_type,
              time_slots: []
            } as Availability;
          }
        })
      );
      
      setAvailabilities(availabilitiesWithSlots);
      return availabilitiesWithSlots;
    } catch (error: any) {
      console.error('Error fetching availabilities:', error);
      setError(error.message);
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
      setError(null);
      
      // Insert availability 
      const availabilityResult = await supabase
        .from('expert_availabilities')
        .insert({
          expert_id: expertId,
          start_date: startDate,
          end_date: endDate,
          availability_type: availabilityType
        })
        .select()
        .single();
      
      if (availabilityResult.error) {
        handleDatabaseError(availabilityResult.error, 'Failed to create availability');
        throw availabilityResult.error;
      }
      
      const newAvailability = availabilityResult.data;
      
      if (!newAvailability) {
        throw new Error('Failed to create availability');
      }
      
      // Insert time slots for each slot
      for (const slot of timeSlots) {
        const slotResult = await supabase
          .from('expert_time_slots')
          .insert({
            availability_id: newAvailability.id,
            start_time: slot.start_time,
            end_time: slot.end_time,
            day_of_week: slot.day_of_week,
            specific_date: slot.specific_date
          });
        
        if (slotResult.error) {
          handleDatabaseError(slotResult.error, 'Failed to create time slot');
          throw slotResult.error;
        }
      }
      
      // Fetch updated availabilities
      await fetchAvailabilities(expertId);
      
      toast.success('Availability created successfully');
      return { availability: newAvailability.id };
    } catch (error: any) {
      console.error('Error creating availability:', error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete availability
  const deleteAvailability = async (availabilityId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Delete the availability 
      const result = await supabase
        .from('expert_availabilities')
        .delete()
        .eq('id', availabilityId);
      
      if (result.error) {
        handleDatabaseError(result.error, 'Failed to delete availability');
        throw result.error;
      }
      
      // Update the state by filtering out the deleted availability
      setAvailabilities(prev => prev.filter(a => a.id !== availabilityId));
      
      toast.success('Availability deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting availability:', error);
      setError(error.message);
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
